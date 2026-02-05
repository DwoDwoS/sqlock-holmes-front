import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { AuthContext } from './AuthContext';
import type { AuthProviderProps, User } from '../types/auth';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        // Pas de token = pas connecté, inutile d'appeler l'API
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    const response = await authService.login(username, password);

    if (response.token) {
      localStorage.setItem('token', response.token);
      
      const userData: User = {
        id: response.id.toString(),
        username: response.username,
        email: response.email,
        role: response.role || 'USER'
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } else {
      throw new Error('Token non reçu du serveur');
    }
  };

  const register = async (username: string, email: string, password: string): Promise<void> => {
    const response = await authService.register(username, email, password);

    if (response.token) {
      localStorage.setItem('token', response.token);
      
      const userData: User = {
        id: response.id.toString(),
        username: response.username,
        email: response.email,
        role: response.role || 'USER'
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
  };

  const updateUser = async (updates: { username?: string; email?: string }): Promise<void> => {
    const response = await authService.updateUser(updates);

    if (response.token) {
      localStorage.setItem('token', response.token);
      
      const userData: User = {
        id: response.id.toString(),
        username: response.username,
        email: response.email,
        role: response.role || 'USER'
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } else {
      throw new Error('Token non reçu du serveur');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};