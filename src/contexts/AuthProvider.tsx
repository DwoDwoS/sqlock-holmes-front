import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
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
      const response = await axios.post('/api/users/login', { username, password });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        setUser(response.data);
      } else {
        const userData = {
          id: response.data.id || 1,
          username: response.data.username || username,
          email: response.data.email || `${username}@example.com`,
          role: response.data.role || 'USER'
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }

      return response.data;

    } catch (error: unknown) {
      const message = error instanceof AxiosError
        ? error.response?.data?.message
        : 'Identifiants incorrects';
      throw new Error(message);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      delete axios.defaults.headers.common['Authorization'];

      const response = await axios.post('/api/users/register', { username, email, password }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      return response.data;

    } catch (error: unknown) {
      const message = error instanceof AxiosError
        ? error.response?.data?.message
        : 'Erreur lors de l\'inscription';
      throw new Error(message);
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