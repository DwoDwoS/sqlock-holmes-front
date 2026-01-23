import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider } from '../contexts/AuthProvider';
import InvestigationPage from '../components/InvestigationPage';

// Mock the API
vi.mock('../api/api', () => ({
  getInvestigationDetails: vi.fn(() => Promise.reject({ response: { status: 404 } })), // Simuler 404 pour utiliser les mocks
  executeSQL: vi.fn(() => Promise.reject({ response: { status: 404 } })),
  getHints: vi.fn(() => Promise.reject({ response: { status: 404 } })),
  startInvestigation: vi.fn(() => Promise.resolve())
}));

// Mock Monaco Editor
vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange }: any) => (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      data-testid="monaco-editor"
    />
  )
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '1' })
  };
});

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
    const { executeSQL } = await import('../api/api');
    renderWithProviders(<InvestigationPage />);

    await waitFor(() => {
      expect(screen.getByText('Exécuter')).toBeInTheDocument();
    });

    const executeButton = screen.getByText('Exécuter');
    fireEvent.click(executeButton);

    await waitFor(() => {
      expect(executeSQL).toHaveBeenCalledWith(1, 'SELECT * FROM table_name;');
    });
  });

  it('should handle hints error gracefully', async () => {
    const { getHints } = await import('../api/api');
    renderWithProviders(<InvestigationPage />);

    await waitFor(() => {
      expect(screen.getByText('Indices')).toBeInTheDocument();
    });

    const hintsButton = screen.getByText('Indices');
    fireEvent.click(hintsButton);

    // Avec l'erreur 404, rien ne devrait s'afficher
    await waitFor(() => {
      expect(getHints).toHaveBeenCalledWith(1);
    });
    // La modale ne devrait pas s'ouvrir
    expect(screen.queryByText('Indice 1')).not.toBeInTheDocument();
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