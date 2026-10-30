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
  message?: string;
}

const extractRegisterErrorMessage = (data: unknown): string | undefined => {
  if (!data || typeof data !== 'object') return undefined;
  const record = data as Record<string, unknown>;
  const direct = [record.message, record.error].find(
    (value): value is string => typeof value === 'string' && value.length > 0
  );
  if (direct) return direct;
  return Object.values(record).find(
    (value): value is string => typeof value === 'string' && value.length > 0
  );
};

export const authService = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  register: async (username: string, email: string, password: string): Promise<RegisterResponse> => {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      return response.data;
    } catch (error) {
      const data = (error as { response?: { data?: unknown } }).response?.data;
      const message = extractRegisterErrorMessage(data);
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