import React, { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
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
        } catch (error) {
          console.error('Token invalide ou expiré:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await authService.login(username, password);

      console.log('Réponse login:', response);

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

    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      
      if (error instanceof AxiosError && (error.code === 'ERR_NETWORK' || error.message === 'Network Error')) {
        console.log('Back-end non disponible, utilisation des données mockées');
        
        const mockUser: User = {
          id: '1',
          username: username,
          email: `${username}@example.com`,
          role: 'USER'
        };
        
        const mockToken = 'mock-jwt-token-' + Date.now();
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
      } else {
        throw error;
      }
    }
  };

  const register = async (username: string, email: string, password: string): Promise<void> => {
    try {
      const response = await authService.register(username, email, password);

      console.log('Réponse inscription:', response);

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

    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      
      if (error instanceof AxiosError && (error.code === 'ERR_NETWORK' || error.message === 'Network Error')) {
        console.log('Back-end non disponible, simulation d\'une inscription réussie');
        
        const mockUser: User = {
          id: Date.now().toString(),
          username: username,
          email: email,
          role: 'USER'
        };
        
        setUser(mockUser);
      } else {
        throw error;
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};