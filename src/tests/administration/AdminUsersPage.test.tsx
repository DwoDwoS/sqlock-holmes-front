import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AdminUsersPage from '../../components/administration/AdminUsersPage';
import { NotificationProvider } from '../../contexts/NotificationProvider';
import type { AdminUserDTO } from '../../types/admin';

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
const mockAdminUsers: AdminUserDTO[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@sqlock.com',
    role: 'ADMIN',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    totalSubmissions: 5,
    solvedInvestigations: 3,
    averageScore: 85.5,
  },
  {
    id: '2',
    username: 'detective1',
    email: 'det1@sqlock.com',
    role: 'USER',
    isActive: true,
    createdAt: '2024-02-20T00:00:00Z',
    totalSubmissions: 10,
    solvedInvestigations: 7,
    averageScore: 90.2,
  },
  {
    id: '3',
    username: 'sherlock',
    email: 'sherlock@sqlock.com',
    role: 'USER',
    isActive: false,
    createdAt: '2024-03-10T00:00:00Z',
    totalSubmissions: 2,
    solvedInvestigations: 1,
    averageScore: 75.0,
  },
];

const mockGetAllUsers = vi.fn();
const mockDeleteUser = vi.fn();
const mockUpdateUserRole = vi.fn();
const mockToggleUserActive = vi.fn();

vi.mock('../../services/adminService', () => ({
  adminService: {
    getAllUsers: () => mockGetAllUsers(),
    deleteUser: (userId: string) => mockDeleteUser(userId),
    updateUserRole: (userId: string, role: 'USER' | 'ADMIN') => mockUpdateUserRole(userId, role),
    toggleUserActive: (userId: string) => mockToggleUserActive(userId),
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

// Mock window.confirm
window.confirm = vi.fn(() => true);

// Mock window.alert
window.alert = vi.fn();

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <NotificationProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </NotificationProvider>
  );
};

describe('AdminUsersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAllUsers.mockResolvedValue(mockAdminUsers);
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
      expect(screen.getByPlaceholderText('Rechercher par nom ou email...')).toBeInTheDocument();
    });
  });

  it('displays filter buttons', async () => {
    renderWithProviders(<AdminUsersPage />);

    await waitFor(() => {
      expect(screen.getByText(/Tous \(3\)/)).toBeInTheDocument();
      expect(screen.getByText(/Users \(2\)/)).toBeInTheDocument();
      expect(screen.getByText(/Admins \(1\)/)).toBeInTheDocument();
    });
  });

  it('displays users table after loading', async () => {
    renderWithProviders(<AdminUsersPage />);

    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument();
      expect(screen.getByText('detective1')).toBeInTheDocument();
      expect(screen.getByText('sherlock')).toBeInTheDocument();
    });
  });

  it('filters users when search term is entered', async () => {
    renderWithProviders(<AdminUsersPage />);

    let searchInput: HTMLElement;
    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument();
      searchInput = screen.getByPlaceholderText('Rechercher par nom ou email...');
    });

    fireEvent.change(searchInput!, { target: { value: 'detective' } });

    await waitFor(() => {
      expect(screen.getByText('detective1')).toBeInTheDocument();
      expect(screen.queryByText('admin')).not.toBeInTheDocument();
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