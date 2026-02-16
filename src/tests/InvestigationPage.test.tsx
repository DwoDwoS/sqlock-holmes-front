import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider } from '../contexts/AuthProvider';
import InvestigationPage from '../components/InvestigationPage';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '1' }),
  };
});

// Mock the API
vi.mock('../api/api', () => ({
  default: {
    get: vi.fn((url) => {
      if (url === '/investigations/1') {
        return Promise.reject({ response: { status: 404 } }); // Simuler 404 pour utiliser les mocks
      }
      if (url === '/investigations/1/hints') {
        return Promise.reject({ response: { status: 404 } });
      }
    }),
    post: vi.fn((url) => {
      if (url === '/sql/execute') {
        return Promise.reject({ response: { status: 404 } });
      }
      if (url === '/investigations/1/start') {
        return Promise.resolve();
      }
      if (url.includes('/submit-solution')) {
        return Promise.reject({ response: { status: 404 } });
      }
    })
  }
}));

// Mock the investigation service
vi.mock('../services/investigationService', () => ({
  getHints: vi.fn(() => Promise.reject({ response: { status: 404 } })),
  getHintCount: vi.fn(() => Promise.reject({ response: { status: 404 } })),
  unlockNextHint: vi.fn(() => Promise.reject({ response: { status: 404 } })),
  getInvestigationDetails: vi.fn(() => Promise.reject({ response: { status: 404 } })),
  submitSolution: vi.fn(() => Promise.reject({ response: { status: 404 } }))
}));

// Mock the SQL service
vi.mock('../services/sqlService', () => ({
  SQLService: {
    executeSQL: vi.fn(() => Promise.reject({ response: { status: 404 } }))
  }
}));

// Mock the hints service
vi.mock('../services/hintsService', () => ({
  HintsService: {
    getHints: vi.fn(() => Promise.reject({ response: { status: 404 } })),
    getHintCount: vi.fn(() => Promise.reject({ response: { status: 404 } })),
    unlockNextHint: vi.fn(() => Promise.reject({ response: { status: 404 } }))
  }
}));

// Mock Monaco Editor
vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      data-testid="monaco-editor"
    />
  )
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('InvestigationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('should render investigation details', async () => {
    renderWithProviders(<InvestigationPage />);

    await waitFor(() => {
      expect(screen.getByText('Le vol du musée')).toBeInTheDocument();
      expect(screen.getByText(/Un tableau de valeur inestimable/)).toBeInTheDocument();
    });
  });

  it('should display Monaco editor', async () => {
    renderWithProviders(<InvestigationPage />);

    await waitFor(() => {
      expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
    });
  });

  it('should execute SQL when button is clicked', async () => {
    const { SQLService } = await import('../services/sqlService');
    renderWithProviders(<InvestigationPage />);

    await waitFor(() => {
      expect(screen.getByText('Exécuter')).toBeInTheDocument();
    });

    const executeButton = screen.getByText('Exécuter');
    fireEvent.click(executeButton);

    await waitFor(() => {
      expect(SQLService.executeSQL).toHaveBeenCalledWith({ investigationId: 1, sql: 'SELECT * FROM museum_employees LIMIT 5;' });
    });
  });

  it('should handle hints gracefully when not authenticated', async () => {
    renderWithProviders(<InvestigationPage />);

    await waitFor(() => {
      expect(screen.getByText('Indices')).toBeInTheDocument();
    });

    const hintsButton = screen.getByText('Indices');
    fireEvent.click(hintsButton);

    // La modal devrait s'ouvrir avec les indices mockés
    await waitFor(() => {
      expect(screen.getByText('Les caméras de sécurité ont enregistré les entrées et sorties du musée.')).toBeInTheDocument();
    });
  });

  it('should navigate back to investigations', async () => {
    renderWithProviders(<InvestigationPage />);

    await waitFor(() => {
      expect(screen.getByText('Retour aux enquêtes')).toBeInTheDocument();
    });

    const backButton = screen.getByText('Retour aux enquêtes');
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/investigations');
  });
});