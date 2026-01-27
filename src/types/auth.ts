import type { ReactNode } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  updateUser: (updates: { username?: string; email?: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface AuthProviderProps {
  children: ReactNode;
}