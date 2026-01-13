import React, { useState } from 'react';
import axios from '../api/api';
import { AuthContext } from './AuthContext';
import type { AuthProviderProps, User } from '../types/auth';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { id: 1, username: 'user', email: 'user@example.com' };
    }
    return null;
  });
  const isLoading = false;

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ id: 1, username, email: `${username}@example.com` });
    } catch {
      throw new Error('Échec de la connexion');
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      await axios.post('/api/auth/register', { username, email, password });
    } catch {
      throw new Error('Inscription échouée');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};