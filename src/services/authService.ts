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

export const authService = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/users/register', { username, email, password });
    return response.data;
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    const response = await api.get('/users/me', {
      validateStatus: () => true, // Accepte tous les statuts pour éviter les logs d'erreur
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