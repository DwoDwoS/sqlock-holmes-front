import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AdminInvestigationsPage from '../../components/administration/AdminInvestigationsPage';
import { NotificationProvider } from '../../contexts/NotificationProvider';

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
const mockUser = {
  id: '1',
  username: 'admin',
  email: 'admin@sqlock.com',
  role: 'ADMIN',
};

const mockUseAuth = vi.fn(() => ({
  user: mockUser,
  isLoading: false,
  logout: vi.fn(),
}));

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <NotificationProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </NotificationProvider>
  );
};

describe('AdminInvestigationsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isLoading: false,
      logout: vi.fn(),
    });
  });

  it('renders investigations management page when user is ADMIN', async () => {
    renderWithProviders(<AdminInvestigationsPage />);

    expect(await screen.findByText('Gestion des Enquêtes')).toBeInTheDocument();
  });

  it('displays back button', async () => {
    renderWithProviders(<AdminInvestigationsPage />);

    expect(await screen.findByText('← Retour au tableau de bord')).toBeInTheDocument();
  });

  it('displays create investigation button', async () => {
    renderWithProviders(<AdminInvestigationsPage />);

    expect(await screen.findByText('+ Créer une enquête')).toBeInTheDocument();
  });

  it('displays mocked investigations after loading', async () => {
    renderWithProviders(<AdminInvestigationsPage />);

    expect(await screen.findByText('Le vol du musée')).toBeInTheDocument();
    expect(await screen.findByText('Fraudes corporatives')).toBeInTheDocument();
    expect(await screen.findByText('Meurtre au Manoir')).toBeInTheDocument();
  });

  it('shows create form when create button is clicked', async () => {
    renderWithProviders(<AdminInvestigationsPage />);

    const createButton = await screen.findByText('+ Créer une enquête');
    fireEvent.click(createButton);

    expect(await screen.findByText('Nouvelle Enquête')).toBeInTheDocument();
    expect(screen.getByText('Titre:')).toBeInTheDocument();
    expect(screen.getByText('Description:')).toBeInTheDocument();
    expect(screen.getByText('Difficulté:')).toBeInTheDocument();
  });

  it('hides create form when cancel button is clicked', async () => {
    renderWithProviders(<AdminInvestigationsPage />);

    const createButton = await screen.findByText('+ Créer une enquête');
    fireEvent.click(createButton);

    expect(await screen.findByText('Nouvelle Enquête')).toBeInTheDocument();

    const cancelButton = await screen.findByText('Annuler');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Nouvelle Enquête')).not.toBeInTheDocument();
    });
  });

  it('displays difficulty badges for mocked data', async () => {
    renderWithProviders(<AdminInvestigationsPage />);

    await screen.findByText('Le vol du musée');
    
    const facile = screen.getAllByText('Facile');
    const moyen = screen.getAllByText('Moyen');
    const difficile = screen.getAllByText('Difficile');
    
    expect(facile.length).toBeGreaterThan(0);
    expect(moyen.length).toBeGreaterThan(0);
    expect(difficile.length).toBeGreaterThan(0);
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