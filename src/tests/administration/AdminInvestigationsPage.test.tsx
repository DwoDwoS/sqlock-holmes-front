import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AdminInvestigationsPage from '../../components/administration/AdminInvestigationsPage';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useAuth hook with admin user
const mockUseAuth = vi.fn(() => ({
  user: {
    id: '1',
    username: 'admin',
    email: 'admin@sqlock.com',
    role: 'ADMIN',
  },
  isLoading: false,
  logout: vi.fn(),
}));

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock window.confirm
window.confirm = vi.fn(() => true);

// Mock window.alert
window.alert = vi.fn();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('AdminInvestigationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders investigations management page when user is ADMIN', async () => {
    renderWithProviders(<AdminInvestigationsPage />);

    await waitFor(() => {
      expect(screen.getByText('Gestion des Enquêtes')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('displays back button', async () => {
    renderWithProviders(<AdminInvestigationsPage />);

    await waitFor(() => {
      expect(screen.getByText('← Retour au tableau de bord')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('displays create investigation button', async () => {
    renderWithProviders(<AdminInvestigationsPage />);

    await waitFor(() => {
      expect(screen.getByText('+ Créer une enquête')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('displays investigations after loading', async () => {
    renderWithProviders(<AdminInvestigationsPage />);

    await waitFor(() => {
      expect(screen.getByText('Le vol du musée')).toBeInTheDocument();
      expect(screen.getByText('Fraudes corporatives')).toBeInTheDocument();
      expect(screen.getByText('Meurtre au Manoir')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('shows create form when create button is clicked', async () => {
    renderWithProviders(<AdminInvestigationsPage />);

    let createButton: HTMLElement;
    await waitFor(() => {
      createButton = screen.getByText((content, element) => {
        return element?.tagName === 'BUTTON' && content.includes('Créer une enquête');
      });
    }, { timeout: 2000 });

    fireEvent.click(createButton!);

    await waitFor(() => {
      expect(screen.getByText('Nouvelle Enquête')).toBeInTheDocument();
      expect(screen.getByLabelText('Titre:')).toBeInTheDocument();
      expect(screen.getByLabelText('Description:')).toBeInTheDocument();
    });
  });

  it('hides create form when button is clicked again', async () => {
    renderWithProviders(<AdminInvestigationsPage />);

    let createButton: HTMLElement;
    await waitFor(() => {
      createButton = screen.getByText((content, element) => {
        return element?.tagName === 'BUTTON' && content.includes('Créer une enquête');
      });
    }, { timeout: 2000 });

    fireEvent.click(createButton!);

    await waitFor(() => {
      expect(screen.getByText('Annuler')).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Annuler');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Nouvelle Enquête')).not.toBeInTheDocument();
    });
  });

  it('displays difficulty badges', async () => {
    renderWithProviders(<AdminInvestigationsPage />);

    await waitFor(() => {
      expect(screen.getByText('Facile')).toBeInTheDocument();
      expect(screen.getByText('Moyen')).toBeInTheDocument();
      expect(screen.getByText('Difficile')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('redirects non-admin users', () => {
    mockUseAuth.mockReturnValueOnce({
      user: {
        id: '2',
        username: 'user',
        email: 'user@sqlock.com',
        role: 'USER',
      },
      isLoading: false,
      logout: vi.fn(),
    });

    renderWithProviders(<AdminInvestigationsPage />);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});