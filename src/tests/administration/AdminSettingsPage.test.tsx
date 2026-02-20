import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AuthProvider } from '../../contexts/AuthProvider';
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
      <AuthProvider>
        {component}
      </AuthProvider>
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
    }, { timeout: 10000 });
  }, 15000);

  it('displays back button', async () => {
    renderWithProviders(<AdminSettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('← Retour au tableau de bord')).toBeInTheDocument();
    }, { timeout: 10000 });
  }, 15000);

  it('displays general configuration section', async () => {
    renderWithProviders(<AdminSettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('Configuration Générale')).toBeInTheDocument();
      expect(screen.getByLabelText('Nom du site:')).toBeInTheDocument();
      expect(screen.getByText('Mode Maintenance')).toBeInTheDocument();
      expect(screen.getByText('Autoriser les inscriptions')).toBeInTheDocument();
    }, { timeout: 10000 });
  }, 15000);

  it('displays investigation settings section', async () => {
    renderWithProviders(<AdminSettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('Paramètres des Enquêtes')).toBeInTheDocument();
      expect(screen.getByLabelText('Nombre max d\'indices par enquête:')).toBeInTheDocument();
    }, { timeout: 10000 });
  }, 15000);

  it('displays notifications section', async () => {
    renderWithProviders(<AdminSettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByText('Notifications par email')).toBeInTheDocument();
    }, { timeout: 10000 });
  }, 15000);

  it('displays advanced options section', async () => {
    renderWithProviders(<AdminSettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('Options Avancées')).toBeInTheDocument();
      expect(screen.getByText('Mode Debug')).toBeInTheDocument();
    }, { timeout: 10000 });
  }, 15000);

  it('displays system actions section', async () => {
    renderWithProviders(<AdminSettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('Actions Système')).toBeInTheDocument();
      expect(screen.getByText('🗑️ Vider le cache')).toBeInTheDocument();
      expect(screen.getByText('📦 Exporter les données')).toBeInTheDocument();
      expect(screen.getByText('⚠️ Réinitialiser les paramètres')).toBeInTheDocument();
    }, { timeout: 10000 });
  }, 15000);

  it('displays save button', async () => {
    renderWithProviders(<AdminSettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('Sauvegarder les modifications')).toBeInTheDocument();
    }, { timeout: 10000 });
  }, 15000);

  it('updates site name when input changes', async () => {
    renderWithProviders(<AdminSettingsPage />);

    await waitFor(() => {
      const input = screen.getByLabelText('Nom du site:') as HTMLInputElement;
      expect(input.value).toBe('SQLock Holmes');
    }, { timeout: 10000 });

    const input = screen.getByLabelText('Nom du site:') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'New Site Name' } });

    expect(input.value).toBe('New Site Name');
  }, 15000);

  it('shows success message when settings are saved', async () => {
    renderWithProviders(<AdminSettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('Sauvegarder les modifications')).toBeInTheDocument();
    }, { timeout: 10000 });

    const saveButton = screen.getByText('Sauvegarder les modifications');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Paramètres sauvegardés avec succès')).toBeInTheDocument();
    }, { timeout: 2000 });
  }, 15000);

  it('clears cache when cache button is clicked', async () => {
    renderWithProviders(<AdminSettingsPage />);

    await waitFor(() => {
      expect(screen.getByText('🗑️ Vider le cache')).toBeInTheDocument();
    }, { timeout: 10000 });

    const cacheButton = screen.getByText('🗑️ Vider le cache');
    fireEvent.click(cacheButton);

    expect(window.confirm).toHaveBeenCalledWith('Êtes-vous sûr de vouloir vider le cache ?');
  }, 15000);

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

  it('shows loading state', () => {
    renderWithProviders(<AdminSettingsPage />);

    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });
});