import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AuthProvider } from '../../contexts/AuthProvider';
import AdminDashboardPage from '../../components/administration/AdminDashboardPage';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock adminService
const mockGetUsersStats = vi.fn();
vi.mock('../../services/adminService', () => ({
  adminService: {
    getUsersStats: () => mockGetUsersStats(),
  },
}));

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

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('AdminDashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUsersStats.mockResolvedValue({
      totalUsers: 10,
      activeUsers: 8,
      inactiveUsers: 2,
      admins: 2,
      regularUsers: 8,
    });
  });

  it('renders admin dashboard when user is ADMIN', async () => {
    renderWithProviders(<AdminDashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Tableau de bord administrateur SQLock Holmes')).toBeInTheDocument();
      expect(screen.getByText(/Bienvenue sur le tableau de bord administrateur/i)).toBeInTheDocument();
    });
  });

  it('displays all management buttons', async () => {
    renderWithProviders(<AdminDashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Gérer les utilisateurs')).toBeInTheDocument();
      expect(screen.getByText('Gérer les enquêtes')).toBeInTheDocument();
      expect(screen.getByText('Paramètres du système')).toBeInTheDocument();
    });
  });

  it('redirects non-admin users to login', () => {
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

    renderWithProviders(<AdminDashboardPage />);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('redirects when no user is authenticated', () => {
    mockUseAuth.mockReturnValueOnce({
      user: null,
      isLoading: false,
      logout: vi.fn(),
    } as unknown as ReturnType<typeof mockUseAuth>);

    renderWithProviders(<AdminDashboardPage />);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});