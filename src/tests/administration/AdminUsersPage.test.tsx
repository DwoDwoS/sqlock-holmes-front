import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AdminUsersPage from '../../components/administration/AdminUsersPage';

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

describe('AdminUsersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders users management page when user is ADMIN', async () => {
    renderWithProviders(<AdminUsersPage />);

    await waitFor(() => {
      expect(screen.getByText('Gestion des Utilisateurs')).toBeInTheDocument();
    });
  });

  it('displays back button', async () => {
    renderWithProviders(<AdminUsersPage />);

    await waitFor(() => {
      expect(screen.getByText('← Retour au tableau de bord')).toBeInTheDocument();
    });
  });

  it('displays search bar', async () => {
    renderWithProviders(<AdminUsersPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Rechercher un utilisateur...')).toBeInTheDocument();
    });
  });

  it('displays filter buttons', async () => {
    renderWithProviders(<AdminUsersPage />);

    await waitFor(() => {
      expect(screen.getByText(/Tous/)).toBeInTheDocument();
      expect(screen.getByText(/Utilisateurs/)).toBeInTheDocument();
      expect(screen.getByText(/Admins/)).toBeInTheDocument();
    });
  });

  it('displays users table after loading', async () => {
    renderWithProviders(<AdminUsersPage />);

    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument();
      expect(screen.getByText('detective1')).toBeInTheDocument();
    });
  });

  it('filters users when search term is entered', async () => {
    renderWithProviders(<AdminUsersPage />);

    let searchInput: HTMLElement;
    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument();
      searchInput = screen.getByPlaceholderText('Rechercher un utilisateur...');
    });

    fireEvent.change(searchInput!, { target: { value: 'detective' } });

    await waitFor(() => {
      expect(screen.getByText('detective1')).toBeInTheDocument();
    });
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

    renderWithProviders(<AdminUsersPage />);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});