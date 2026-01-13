import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from '../api/api';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ id: 1, username: 'user', email: 'user@example.com' });
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ id: 1, username, email: `${username}@example.com` });
    } catch (error) {
      throw new Error('Échec de la connexion');
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      await axios.post('/api/auth/register', { username, email, password });
    } catch (error) {
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