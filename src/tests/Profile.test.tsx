import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import { AuthProvider } from '../contexts/AuthProvider';
import Profile from '../components/Profile';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock authService
vi.mock('../services/authService', () => ({
  authService: {
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  },
}));

// Mock useAuth hook
const mockLogout = vi.fn();
const mockUpdateUser = vi.fn();
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
      role: 'USER',
    },
    logout: mockLogout,
    updateUser: mockUpdateUser,
  })
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </AuthProvider>
  );
};

describe('Profile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders profile information', () => {
    renderWithProviders(<Profile />);

    expect(screen.getByText('Mon Profil')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('shows edit form when edit button is clicked', () => {
    renderWithProviders(<Profile />);

    const editButton = screen.getByText('Modifier le profil');
    fireEvent.click(editButton);

    expect(screen.getByLabelText('Nom d\'utilisateur:')).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('Nouveau mot de passe (optionnel):')).toBeInTheDocument();
    expect(screen.getByText('Mettre à jour')).toBeInTheDocument();
  });

  it('shows delete confirmation when delete button is clicked', () => {
    renderWithProviders(<Profile />);

    const deleteButton = screen.getByText('Supprimer mon compte');
    fireEvent.click(deleteButton);

    expect(screen.getByText('Êtes-vous sûr de vouloir supprimer votre compte ?')).toBeInTheDocument();
    expect(screen.getByText('Oui, supprimer')).toBeInTheDocument();
  });
});