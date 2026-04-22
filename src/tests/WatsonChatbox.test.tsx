import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import type { Mock } from 'vitest';
import WatsonChatbox from '../components/WatsonChatbox/WatsonChatbox';
import * as watsonService from '../services/watsonService';
import { useAuth } from '../hooks/useAuth';
import type { AiChatResponse, AiStatusResponse } from '../types/watson';

beforeAll(() => {
  // jsdom does not implement scrollIntoView — the chatbox calls it on mount/update.
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = vi.fn();
  }
});

vi.mock('../services/watsonService');
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

let currentSqlValue: string | null = null;
vi.mock('../hooks/useCurrentSql', () => ({
  useCurrentSql: () => ({
    getCurrentSql: () => currentSqlValue,
    setCurrentSql: (v: string | null) => {
      currentSqlValue = v;
    },
  }),
}));

const mockedUseAuth = useAuth as unknown as Mock;

const baseStatus: AiStatusResponse = {
  tokensRemainingThisHour: 5000,
  requestsRemainingThisHour: 15,
  maxTokensPerHour: 5000,
  maxRequestsPerHour: 15,
  resetAt: '15:00',
};

const okResponse: AiChatResponse = {
  reply: 'Regarde la colonne **entry_time** dans `visitors`.',
  tokensUsed: 30,
  tokensRemainingThisHour: 4970,
  requestsRemainingThisHour: 14,
  fromCache: false,
};

const setAuthenticated = () => {
  mockedUseAuth.mockReturnValue({
    user: { id: '1', username: 'alice', email: 'a@b.c', role: 'USER', token: 't' },
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  });
};

const setUnauthenticated = () => {
  mockedUseAuth.mockReturnValue({
    user: null,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  });
};

describe('WatsonChatbox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentSqlValue = null;
    vi.spyOn(watsonService, 'getStatus').mockResolvedValue(baseStatus);
    (watsonService.sendMessage as Mock).mockResolvedValue(okResponse);
  });

  it('renders nothing when the user is not authenticated', () => {
    setUnauthenticated();
    const { container } = render(<WatsonChatbox />);
    expect(container).toBeEmptyDOMElement();
    expect(watsonService.getStatus).not.toHaveBeenCalled();
  });

  it('renders the toggle button when the user is authenticated', async () => {
    setAuthenticated();
    render(<WatsonChatbox />);

    expect(await screen.findByRole('button', { name: /ouvrir watson/i })).toBeInTheDocument();
  });

  it('opens the panel and focuses the textarea on toggle', async () => {
    setAuthenticated();
    const user = userEvent.setup();
    render(<WatsonChatbox />);

    await user.click(screen.getByRole('button', { name: /ouvrir watson/i }));

    expect(screen.getByRole('dialog', { name: /watson assistant/i })).toHaveAttribute('aria-hidden', 'false');
    expect(screen.getByPlaceholderText(/écrivez à watson/i)).toBeInTheDocument();
  });

  it('sends a message, displays user + Watson bubbles, and forwards investigationId', async () => {
    setAuthenticated();
    const user = userEvent.setup();
    render(<WatsonChatbox investigationId={7} />);

    await user.click(screen.getByRole('button', { name: /ouvrir watson/i }));

    const textarea = screen.getByPlaceholderText(/écrivez à watson/i);
    await user.type(textarea, 'Quelles tables ?');
    await user.click(screen.getByRole('button', { name: /envoyer/i }));

    expect(watsonService.sendMessage).toHaveBeenCalledWith(
      'Quelles tables ?',
      7,
      [],
    );

    expect(await screen.findByText('Quelles tables ?')).toBeInTheDocument();
    // Watson reply contains markdown — bold + inline code renders as separate elements.
    expect(await screen.findByText('entry_time')).toBeInTheDocument();
    expect(screen.getByText('visitors')).toBeInTheDocument();
  });

  it('Enter submits the message, Shift+Enter inserts a newline', async () => {
    setAuthenticated();
    const user = userEvent.setup();
    render(<WatsonChatbox />);

    await user.click(screen.getByRole('button', { name: /ouvrir watson/i }));

    const textarea = screen.getByPlaceholderText(/écrivez à watson/i) as HTMLTextAreaElement;
    await user.type(textarea, 'ligne1');
    await user.keyboard('{Shift>}{Enter}{/Shift}');
    await user.type(textarea, 'ligne2');
    // Textarea now has a newline baked in.
    expect(textarea.value).toBe('ligne1\nligne2');

    await user.keyboard('{Enter}');
    expect(watsonService.sendMessage).toHaveBeenCalledWith('ligne1\nligne2', undefined, []);
  });

  it('does not submit when the input is whitespace only', async () => {
    setAuthenticated();
    const user = userEvent.setup();
    render(<WatsonChatbox />);

    await user.click(screen.getByRole('button', { name: /ouvrir watson/i }));
    const sendBtn = screen.getByRole('button', { name: /envoyer/i });
    expect(sendBtn).toBeDisabled();

    await user.type(screen.getByPlaceholderText(/écrivez à watson/i), '   ');
    expect(sendBtn).toBeDisabled();
  });

  it('renders the quota bar with the current remaining tokens', async () => {
    setAuthenticated();
    render(<WatsonChatbox />);

    expect(await screen.findByText(/5000 \/ 5000 tokens/)).toBeInTheDocument();
    expect(screen.getByText(/réinit\. 15:00/i)).toBeInTheDocument();
  });

  it('clearHistory empties the conversation view', async () => {
    setAuthenticated();
    const user = userEvent.setup();
    render(<WatsonChatbox />);

    await user.click(screen.getByRole('button', { name: /ouvrir watson/i }));
    await user.type(screen.getByPlaceholderText(/écrivez à watson/i), 'salut');
    await user.click(screen.getByRole('button', { name: /envoyer/i }));

    expect(await screen.findByText('salut')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^effacer$/i }));

    expect(screen.queryByText('salut')).not.toBeInTheDocument();
    expect(screen.getByText(/bonjour détective/i)).toBeInTheDocument();
  });

  it('shows the orange rate-limit banner on 429 responses', async () => {
    setAuthenticated();
    (watsonService.sendMessage as Mock).mockImplementation(async () => {
      const err = Object.assign(new Error('limit'), {
        isAxiosError: true,
        response: {
          status: 429,
          data: {
            message: 'Trop de requêtes',
            tokensRemainingThisHour: 2000,
            requestsRemainingThisHour: 0,
            resetAt: '16:00',
          },
        },
      });
      throw err;
    });

    const user = userEvent.setup();
    render(<WatsonChatbox investigationId={1} />);

    await user.click(screen.getByRole('button', { name: /ouvrir watson/i }));
    await user.type(screen.getByPlaceholderText(/écrivez à watson/i), 'hello');
    await user.click(screen.getByRole('button', { name: /envoyer/i }));

    expect(await screen.findByText(/limite atteinte, retente à 16:00/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/patientez avant de relancer/i)).toBeDisabled();
  });

  it('omits investigationId in the service call when not provided', async () => {
    setAuthenticated();
    const user = userEvent.setup();
    render(<WatsonChatbox />);

    await user.click(screen.getByRole('button', { name: /ouvrir watson/i }));
    await user.type(screen.getByPlaceholderText(/écrivez à watson/i), 'Q');
    await user.click(screen.getByRole('button', { name: /envoyer/i }));

    await act(async () => {
      // Wait for the send promise chain.
      await Promise.resolve();
    });

    expect(watsonService.sendMessage).toHaveBeenCalledWith('Q', undefined, []);
  });

  describe('SQL attachment', () => {
    it('does not show the attach button when investigationId is undefined', async () => {
      setAuthenticated();
      currentSqlValue = 'SELECT * FROM visitors;';
      const user = userEvent.setup();
      render(<WatsonChatbox />);

      await user.click(screen.getByRole('button', { name: /ouvrir watson/i }));

      expect(screen.queryByRole('button', { name: /joindre ma requête/i })).not.toBeInTheDocument();
    });

    it('shows the attach button on an investigation page', async () => {
      setAuthenticated();
      currentSqlValue = 'SELECT * FROM visitors;';
      const user = userEvent.setup();
      render(<WatsonChatbox investigationId={1} />);

      await user.click(screen.getByRole('button', { name: /ouvrir watson/i }));

      expect(screen.getByRole('button', { name: /joindre ma requête/i })).toBeInTheDocument();
    });

    it('shows a notice when the current SQL is empty and attach is clicked', async () => {
      setAuthenticated();
      currentSqlValue = '   ';
      const user = userEvent.setup();
      render(<WatsonChatbox investigationId={1} />);

      await user.click(screen.getByRole('button', { name: /ouvrir watson/i }));
      await user.click(screen.getByRole('button', { name: /joindre ma requête/i }));

      expect(screen.getByText(/aucune requête à joindre/i)).toBeInTheDocument();
      // No chip created — attach button still visible.
      expect(screen.getByRole('button', { name: /joindre ma requête/i })).toBeInTheDocument();
    });

    it('attaching replaces the attach button with a removable chip', async () => {
      setAuthenticated();
      currentSqlValue = 'SELECT name FROM visitors WHERE exit_time IS NULL;';
      const user = userEvent.setup();
      render(<WatsonChatbox investigationId={1} />);

      await user.click(screen.getByRole('button', { name: /ouvrir watson/i }));
      await user.click(screen.getByRole('button', { name: /joindre ma requête/i }));

      expect(screen.queryByRole('button', { name: /joindre ma requête/i })).not.toBeInTheDocument();
      expect(screen.getByText(/requête sql jointe/i)).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /retirer la requête/i }));
      expect(screen.getByRole('button', { name: /joindre ma requête/i })).toBeInTheDocument();
    });

    it('embeds the SQL in a fenced block inside the sent message', async () => {
      setAuthenticated();
      const sql = 'SELECT name FROM visitors WHERE exit_time IS NULL;';
      currentSqlValue = sql;
      const user = userEvent.setup();
      render(<WatsonChatbox investigationId={1} />);

      await user.click(screen.getByRole('button', { name: /ouvrir watson/i }));
      await user.click(screen.getByRole('button', { name: /joindre ma requête/i }));
      await user.type(screen.getByPlaceholderText(/écrivez à watson/i), 'Ça marche ?');
      await user.click(screen.getByRole('button', { name: /envoyer/i }));

      expect(watsonService.sendMessage).toHaveBeenCalledTimes(1);
      const [sentMessage, sentInvestigationId] = (watsonService.sendMessage as Mock).mock.calls[0];
      expect(sentInvestigationId).toBe(1);
      expect(sentMessage).toContain('Ça marche ?');
      expect(sentMessage).toContain('```sql');
      expect(sentMessage).toContain(sql);
      expect(sentMessage).toContain('```');
    });

    it('clears the attachment chip after sending', async () => {
      setAuthenticated();
      currentSqlValue = 'SELECT 1;';
      const user = userEvent.setup();
      render(<WatsonChatbox investigationId={1} />);

      await user.click(screen.getByRole('button', { name: /ouvrir watson/i }));
      await user.click(screen.getByRole('button', { name: /joindre ma requête/i }));
      await user.type(screen.getByPlaceholderText(/écrivez à watson/i), 'hello');
      await user.click(screen.getByRole('button', { name: /envoyer/i }));

      await waitFor(() => {
        expect(screen.queryByText(/requête sql jointe/i)).not.toBeInTheDocument();
      });
      expect(screen.getByRole('button', { name: /joindre ma requête/i })).toBeInTheDocument();
    });
  });
});