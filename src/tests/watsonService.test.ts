import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { sendMessage, getStatus } from '../services/watsonService';
import type { AiChatResponse, AiStatusResponse, AiMessage } from '../types/watson';
import api from '../api/api';

vi.mock('../api/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('watsonService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendMessage', () => {
    const response: AiChatResponse = {
      reply: 'Bonjour détective.',
      tokensUsed: 42,
      tokensRemainingThisHour: 4958,
      requestsRemainingThisHour: 14,
      fromCache: false,
    };

    it('sends a minimal payload with only the message when investigationId and history are omitted', async () => {
      (api.post as Mock).mockResolvedValue({ data: response });

      const result = await sendMessage('Salut Watson');

      expect(api.post).toHaveBeenCalledWith('/ai/chat', { message: 'Salut Watson' });
      expect(result).toEqual(response);
    });

    it('includes investigationId when provided', async () => {
      (api.post as Mock).mockResolvedValue({ data: response });

      await sendMessage('Aide-moi sur la table', 7);

      expect(api.post).toHaveBeenCalledWith('/ai/chat', {
        message: 'Aide-moi sur la table',
        investigationId: 7,
      });
    });

    it('includes history when it is non-empty', async () => {
      (api.post as Mock).mockResolvedValue({ data: response });
      const history: AiMessage[] = [
        { role: 'user', content: 'Q1' },
        { role: 'model', content: 'R1' },
      ];

      await sendMessage('Q2', 3, history);

      expect(api.post).toHaveBeenCalledWith('/ai/chat', {
        message: 'Q2',
        investigationId: 3,
        history,
      });
    });

    it('omits history when it is an empty array', async () => {
      (api.post as Mock).mockResolvedValue({ data: response });

      await sendMessage('Q', 3, []);

      const payload = (api.post as Mock).mock.calls[0][1];
      expect(payload).not.toHaveProperty('history');
    });

    it('propagates API errors to the caller', async () => {
      const err = new Error('500 boom');
      (api.post as Mock).mockRejectedValue(err);

      await expect(sendMessage('x')).rejects.toThrow('500 boom');
    });
  });

  describe('getStatus', () => {
    it('fetches quota status from /ai/status', async () => {
      const status: AiStatusResponse = {
        tokensRemainingThisHour: 5000,
        requestsRemainingThisHour: 15,
        maxTokensPerHour: 5000,
        maxRequestsPerHour: 15,
        resetAt: '15:00',
      };
      (api.get as Mock).mockResolvedValue({ data: status });

      const result = await getStatus();

      expect(api.get).toHaveBeenCalledWith('/ai/status');
      expect(result).toEqual(status);
    });

    it('propagates errors from the API', async () => {
      (api.get as Mock).mockRejectedValue(new Error('network down'));

      await expect(getStatus()).rejects.toThrow('network down');
    });
  });
});