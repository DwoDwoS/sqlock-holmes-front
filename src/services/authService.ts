import api from '../api/api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  token: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
}

export interface RegisterResponse {
  id?: string;
  username?: string;
  email?: string;
  role?: 'USER' | 'ADMIN';
  token?: string;
  message?: string;
}

export const authService = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  register: async (username: string, email: string, password: string): Promise<RegisterResponse> => {
    try {
      const response = await api.post('/users/register', { username, email, password });
      return response.data;
    } catch (error) {
      const axiosError = error as { response?: { data?: { message?: string; error?: string } } };
      const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
      if (message) throw new Error(message);
      throw error;
    }
  },

  verifyEmail: async (token: string): Promise<{ message?: string }> => {
    const response = await api.get('/auth/verify-email', { params: { token } });
    return response.data;
  },

  resendVerification: async (identifier: string): Promise<{ message?: string }> => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const payload = isEmail ? { email: identifier } : { username: identifier };
    const response = await api.post('/auth/resend-verification', payload);
    return response.data;
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    const response = await api.get('/users/me', {
      validateStatus: () => true,
    });
    
    if (response.status !== 200) {
      throw new Error('Unauthorized');
    }
    
    return response.data;
  },

  updateUser: async (updates: UpdateUserRequest): Promise<AuthResponse> => {
    const response = await api.put('/users/profile', updates);
    return response.data;
  },

  deleteUser: async (): Promise<void> => {
    await api.delete('/users/profile');
  },
};