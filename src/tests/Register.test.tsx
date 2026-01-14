import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Register from '../components/Register';
import { AuthProvider } from '../contexts/AuthProvider';

// Mock useAuth hook
const mockRegister = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    register: mockRegister
  })
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

const renderRegister = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Register />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Register Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('should render all form fields and submit button', () => {
      renderRegister();

      expect(screen.getByLabelText(/nom d'utilisateur/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^mot de passe/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirmez le mot de passe/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeInTheDocument();
      expect(screen.getByText(/vous avez déjà un compte/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /connexion/i })).toBeInTheDocument();
    });

    it('should render the heading', () => {
      renderRegister();
      expect(screen.getByRole('heading', { name: /inscrivez-vous/i })).toBeInTheDocument();
    });
  });

  describe('Username Validation', () => {
    it('should show error for empty username', async () => {
      renderRegister();

      const usernameInput = screen.getByLabelText(/nom d'utilisateur/i);
      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });

      fireEvent.blur(usernameInput);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Le nom d'utilisateur est obligatoire")).toBeInTheDocument();
      });
    });

    it('should show error for username too short', async () => {
      renderRegister();

      const usernameInput = screen.getByLabelText(/nom d'utilisateur/i);
      fireEvent.change(usernameInput, { target: { value: 'ab' } });
      fireEvent.blur(usernameInput);

      await waitFor(() => {
        expect(screen.getByText("Le nom d'utilisateur doit contenir entre 3 et 50 caractères")).toBeInTheDocument();
      });
    });

    it('should show error for username too long', async () => {
      renderRegister();

      const usernameInput = screen.getByLabelText(/nom d'utilisateur/i);
      const longUsername = 'a'.repeat(51);
      fireEvent.change(usernameInput, { target: { value: longUsername } });
      fireEvent.blur(usernameInput);

      await waitFor(() => {
        expect(screen.getByText("Le nom d'utilisateur doit contenir entre 3 et 50 caractères")).toBeInTheDocument();
      });
    });

    it('should show error for invalid characters in username', async () => {
      renderRegister();

      const usernameInput = screen.getByLabelText(/nom d'utilisateur/i);
      fireEvent.change(usernameInput, { target: { value: 'user@name' } });
      fireEvent.blur(usernameInput);

      await waitFor(() => {
        expect(screen.getByText("Le nom d'utilisateur contient des caractères invalides")).toBeInTheDocument();
      });
    });

    it('should accept valid username with letters, numbers, spaces, and hyphens', async () => {
      renderRegister();

      const usernameInput = screen.getByLabelText(/nom d'utilisateur/i);
      fireEvent.change(usernameInput, { target: { value: 'User-123 Test' } });
      fireEvent.blur(usernameInput);

      await waitFor(() => {
        expect(screen.queryByText(/caractères invalides/)).not.toBeInTheDocument();
      });
    });

    it('should clear username error when valid input is entered', async () => {
      renderRegister();

      const usernameInput = screen.getByLabelText(/nom d'utilisateur/i);

      fireEvent.change(usernameInput, { target: { value: 'u' } });
      fireEvent.blur(usernameInput);

      await waitFor(() => {
        expect(screen.getByText("Le nom d'utilisateur doit contenir entre 3 et 50 caractères")).toBeInTheDocument();
      });

      fireEvent.change(usernameInput, { target: { value: 'validuser' } });
      fireEvent.blur(usernameInput);

      await waitFor(() => {
        expect(screen.queryByText("Le nom d'utilisateur doit contenir entre 3 et 50 caractères")).not.toBeInTheDocument();
      });
    });
  });

  describe('Email Validation', () => {
    it('should show error for empty email', async () => {
      renderRegister();

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });

      fireEvent.blur(emailInput);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("L'email est obligatoire")).toBeInTheDocument();
      });
    });

    it('should show error for invalid email format', async () => {
      renderRegister();

      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(screen.getByText("L'email doit être valide")).toBeInTheDocument();
      });
    });

    it('should accept valid email', async () => {
      renderRegister();

      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.blur(emailInput);

      await waitFor(() => {
        expect(screen.queryByText(/email/)).not.toBeInTheDocument();
      });
    });
  });

  describe('Password Validation', () => {
    it('should show error for empty password', async () => {
      renderRegister();

      const passwordInput = screen.getByLabelText(/^mot de passe/i);
      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });

      fireEvent.blur(passwordInput);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Le mot de passe est obligatoire')).toBeInTheDocument();
      });
    });

    it('should show error for password too short', async () => {
      renderRegister();

      const passwordInput = screen.getByLabelText(/^mot de passe/i);
      fireEvent.change(passwordInput, { target: { value: '12345' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(screen.getByText('Le mot de passe doit contenir au moins 8 caractères')).toBeInTheDocument();
      });
    });

    it('should show error for password without uppercase', async () => {
      renderRegister();

      const passwordInput = screen.getByLabelText(/^mot de passe/i);
      fireEvent.change(passwordInput, { target: { value: 'password123!' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(screen.getByText(/majuscule.*minuscule.*chiffre.*spécial/i)).toBeInTheDocument();
      });
    });

    it('should show error for password without lowercase', async () => {
      renderRegister();

      const passwordInput = screen.getByLabelText(/^mot de passe/i);
      fireEvent.change(passwordInput, { target: { value: 'PASSWORD123!' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(screen.getByText(/majuscule.*minuscule.*chiffre.*spécial/i)).toBeInTheDocument();
      });
    });

    it('should show error for password without digit', async () => {
      renderRegister();

      const passwordInput = screen.getByLabelText(/^mot de passe/i);
      fireEvent.change(passwordInput, { target: { value: 'Password!' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(screen.getByText(/majuscule.*minuscule.*chiffre.*spécial/i)).toBeInTheDocument();
      });
    });

    it('should show error for password without special character', async () => {
      renderRegister();

      const passwordInput = screen.getByLabelText(/^mot de passe/i);
      fireEvent.change(passwordInput, { target: { value: 'Password123' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(screen.getByText(/majuscule.*minuscule.*chiffre.*spécial/i)).toBeInTheDocument();
      });
    });

    it('should accept valid password', async () => {
      renderRegister();

      const passwordInput = screen.getByLabelText(/^mot de passe/i);
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.blur(passwordInput);

      await waitFor(() => {
        expect(screen.queryByText(/Le mot de passe est obligatoire/)).not.toBeInTheDocument();
        expect(screen.queryByText(/doit contenir au moins 8 caractères/)).not.toBeInTheDocument();
        expect(screen.queryByText(/majuscule.*minuscule.*chiffre.*spécial/)).not.toBeInTheDocument();
      });
    });
  });

  describe('Confirm Password Validation', () => {
    it('should show error when passwords do not match', async () => {
      renderRegister();

      const passwordInput = screen.getByLabelText(/^mot de passe/i);
      const confirmPasswordInput = screen.getByLabelText(/confirmez le mot de passe/i);

      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'Different123!' } });
      fireEvent.blur(confirmPasswordInput);

      await waitFor(() => {
        expect(screen.getByText('Les mots de passe ne correspondent pas')).toBeInTheDocument();
      });
    });

    it('should clear error when passwords match', async () => {
      renderRegister();

      const passwordInput = screen.getByLabelText(/^mot de passe/i);
      const confirmPasswordInput = screen.getByLabelText(/confirmez le mot de passe/i);

      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'Different123!' } });
      fireEvent.blur(confirmPasswordInput);

      await waitFor(() => {
        expect(screen.getByText('Les mots de passe ne correspondent pas')).toBeInTheDocument();
      });

      fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
      fireEvent.blur(confirmPasswordInput);

      await waitFor(() => {
        expect(screen.queryByText('Les mots de passe ne correspondent pas')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should not submit form with validation errors', async () => {
      renderRegister();

      const usernameInput = screen.getByLabelText(/nom d'utilisateur/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^mot de passe/i);
      const confirmPasswordInput = screen.getByLabelText(/confirmez le mot de passe/i);
      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });

      fireEvent.blur(usernameInput);
      fireEvent.blur(emailInput);
      fireEvent.blur(passwordInput);
      fireEvent.blur(confirmPasswordInput);

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).not.toHaveBeenCalled();
      });

      expect(screen.getByText("Le nom d'utilisateur est obligatoire")).toBeInTheDocument();
      expect(screen.getByText("L'email est obligatoire")).toBeInTheDocument();
      expect(screen.getByText('Le mot de passe est obligatoire')).toBeInTheDocument();
    });

    it('should submit form with valid data', async () => {
      mockRegister.mockResolvedValueOnce({ success: true });

      renderRegister();

      const usernameInput = screen.getByLabelText(/nom d'utilisateur/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^mot de passe/i);
      const confirmPasswordInput = screen.getByLabelText(/confirmez le mot de passe/i);
      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith('testuser', 'test@example.com', 'Password123!');
      });

      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('should show error message on registration failure', async () => {
      mockRegister.mockRejectedValueOnce(new Error("L'inscription a échoué. Veuillez réessayer."));

      renderRegister();

      const usernameInput = screen.getByLabelText(/nom d'utilisateur/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^mot de passe/i);
      const confirmPasswordInput = screen.getByLabelText(/confirmez le mot de passe/i);
      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });

      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("L'inscription a échoué. Veuillez réessayer.")).toBeInTheDocument();
      });
    });
  });
});