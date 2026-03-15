// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@/types/authTypes';
import { authService } from '@/services/authServices';

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function validateSession() {
      try {
        const me = await authService.getMe();
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    validateSession();
  }, []);

  async function login(username: string, password: string) {
    await authService.login({ username, password });
    const me = await authService.getMe();
    setUser(me);
  }

  async function logout() {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);