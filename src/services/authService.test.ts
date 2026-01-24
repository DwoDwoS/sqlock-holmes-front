import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from './authService';
import api from '../api/api';

// Mock the API module
vi.mock('../api/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully and return user data', async () => {
      const mockResponse = {
        data: {
          id: '123',
          username: 'testuser',
          email: 'test@example.com',
          role: 'USER' as const,
          token: 'mock-token',
        },
      };
      (api.post as any).mockResolvedValue(mockResponse);

      const result = await authService.login('testuser', 'password');

      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        username: 'testuser',
        password: 'password',
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error on login failure', async () => {
      const mockError = new Error('Login failed');
      (api.post as any).mockRejectedValue(mockError);

      await expect(authService.login('testuser', 'wrongpassword')).rejects.toThrow('Login failed');
    });
  });

  describe('register', () => {
    it('should register successfully and return user data', async () => {
      const mockResponse = {
        data: {
          id: '456',
          username: 'newuser',
          email: 'new@example.com',
          role: 'USER' as const,
          token: 'mock-token',
        },
      };
      (api.post as any).mockResolvedValue(mockResponse);

      const result = await authService.register('newuser', 'new@example.com', 'password');

      expect(api.post).toHaveBeenCalledWith('/users/register', {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password',
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error on register failure', async () => {
      const mockError = new Error('Registration failed');
      (api.post as any).mockRejectedValue(mockError);

      await expect(authService.register('newuser', 'new@example.com', 'password')).rejects.toThrow('Registration failed');
    });
  });

  describe('getCurrentUser', () => {
    it('should fetch current user data', async () => {
      const mockResponse = {
        data: {
          id: '123',
          username: 'testuser',
          email: 'test@example.com',
          role: 'USER' as const,
          token: 'mock-token',
        },
      };
      (api.get as any).mockResolvedValue(mockResponse);

      const result = await authService.getCurrentUser();

      expect(api.get).toHaveBeenCalledWith('/users/me');
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error on fetch failure', async () => {
      const mockError = new Error('Fetch failed');
      (api.get as any).mockRejectedValue(mockError);

      await expect(authService.getCurrentUser()).rejects.toThrow('Fetch failed');
    });
  });
});