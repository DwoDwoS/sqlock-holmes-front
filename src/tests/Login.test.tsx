import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Login from '../components/Login';
import { AuthProvider } from '../contexts/AuthProvider';

// Mock useAuth hook
const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin
  })
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('should render all form fields and submit button', () => {
      renderLogin();

      expect(screen.getByLabelText(/nom d'utilisateur/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /connexion/i })).toBeInTheDocument();
      expect(screen.getByText(/pas encore de compte/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /inscrivez-vous/i })).toBeInTheDocument();
    });

    it('should render the heading', () => {
      renderLogin();
      expect(screen.getByRole('heading', { name: /connexion/i })).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('should allow username input', () => {
      renderLogin();

      const usernameInput = screen.getByLabelText(/nom d'utilisateur/i);
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });

      expect(usernameInput).toHaveValue('testuser');
    });

    it('should allow password input', () => {
      renderLogin();

      const passwordInput = screen.getByLabelText(/mot de passe/i);
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      expect(passwordInput).toHaveValue('password123');
    });

    it('should render submit button', () => {
      renderLogin();

      const submitButton = screen.getByRole('button', { name: /connexion/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Navigation', () => {
    it('should have register link', () => {
      renderLogin();

      const registerLink = screen.getByRole('link', { name: /inscrivez-vous/i });
      expect(registerLink).toHaveAttribute('href', '/register');
    });
  });
});