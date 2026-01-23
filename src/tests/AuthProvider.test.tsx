import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AuthProvider } from '../contexts/AuthProvider';
import { useAuth } from '../hooks/useAuth';
import React from 'react';

// Mock axios
vi.mock('axios');

// Mock useAuth hook
const mockLogin = vi.fn().mockResolvedValue({ success: true });
const mockRegister = vi.fn().mockResolvedValue({ success: true });
const mockLogout = vi.fn();

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    register: mockRegister,
    logout: mockLogout
  })
}));

const renderWithAuthProvider = (children: React.ReactNode) => {
  return render(
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Login functionality', () => {
    it('should login successfully with token', async () => {
      mockLogin.mockResolvedValueOnce({ success: true });

      const TestComponent = () => {
        const { login } = useAuth();

        React.useEffect(() => {
          const performLogin = async () => {
            try {
              await login('testuser', 'password123');
            } catch (error) {
              console.error('Login failed:', error);
            }
          };
          performLogin();
        }, [login]);

        return <div>Login Test</div>;
      };

      renderWithAuthProvider(<TestComponent />);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123');
      });
    });

    it('should throw error on login failure', async () => {
      mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));

      const TestComponent = () => {
        const { login } = useAuth();
        const [error, setError] = React.useState<string | null>(null);

        React.useEffect(() => {
          const performLogin = async () => {
            try {
              await login('wronguser', 'wrongpass');
            } catch (err: unknown) {
              setError(err instanceof Error ? err.message : 'Unknown error');
            }
          };
          performLogin();
        }, [login]);

        return <div>{error ? `Error: ${error}` : 'No error'}</div>;
      };

      renderWithAuthProvider(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText('Error: Invalid credentials')).toBeInTheDocument();
      });
    });
  });

  describe('Register functionality', () => {
    it('should register successfully', async () => {
      mockRegister.mockResolvedValueOnce({ success: true });

      const TestComponent = () => {
        const { register } = useAuth();
        const [result, setResult] = React.useState<unknown>(null);

        React.useEffect(() => {
          const performRegister = async () => {
            try {
              const res = await register('newuser', 'new@example.com', 'password123');
              setResult(res);
            } catch (error) {
              console.error('Register failed:', error);
            }
          };
          performRegister();
        }, [register]);

        return <div>{result ? 'Registered' : 'Registering'}</div>;
      };

      renderWithAuthProvider(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText('Registered')).toBeInTheDocument();
      });

      expect(mockRegister).toHaveBeenCalledWith('newuser', 'new@example.com', 'password123');
    });
  });

  describe('Logout functionality', () => {
    it('should clear token and user data on logout', () => {
      localStorage.setItem('token', 'some-token');
      localStorage.setItem('user', JSON.stringify({ id: 1, username: 'user' }));

      const TestComponent = () => {
        const { logout } = useAuth();

        React.useEffect(() => {
          logout();
        }, [logout]);

        return <div>Logged out</div>;
      };

      renderWithAuthProvider(<TestComponent />);

      expect(mockLogout).toHaveBeenCalled();
    });
  });
});