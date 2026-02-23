import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AdminSettingsPage from '../../components/administration/AdminSettingsPage';

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

describe('AdminSettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders settings page when user is ADMIN', async () => {
    renderWithProviders(<AdminSettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('Paramètres du Système')).toBeInTheDocument();
    });
  });

  it('displays back button', async () => {
    renderWithProviders(<AdminSettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('← Retour au tableau de bord')).toBeInTheDocument();
    });
  });

  it('displays general configuration section', async () => {
    renderWithProviders(<AdminSettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('Configuration Générale')).toBeInTheDocument();
    });
    expect(screen.getByText('Mode Maintenance')).toBeInTheDocument();
    expect(screen.getByText('Autoriser les inscriptions')).toBeInTheDocument();
  });

  it('displays notifications section', async () => {
    renderWithProviders(<AdminSettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('Notifications')).toBeInTheDocument();
    });
    expect(screen.getByText('Notifications par email')).toBeInTheDocument();
  });

  it('displays save button', async () => {
    renderWithProviders(<AdminSettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('Sauvegarder les modifications')).toBeInTheDocument();
    });
  });

  it('shows success message when settings are saved', async () => {
    renderWithProviders(<AdminSettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('Sauvegarder les modifications')).toBeInTheDocument();
    });

    const saveButton = screen.getByText('Sauvegarder les modifications');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Paramètres sauvegardés avec succès')).toBeInTheDocument();
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

    renderWithProviders(<AdminSettingsPage />);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});