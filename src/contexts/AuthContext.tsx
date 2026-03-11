// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@/types/authTypes';
import { authService } from '@/services/authServices';
import { addToast } from '@heroui/toast';

const TOKEN_KEY = '@SimpleNote:token';

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
    async function validateToken() {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await authService.getMe();
        setUser(me);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
        addToast({
          title: 'Sessão expirada',
          description: 'Faça login novamente.',
          color: 'warning',
          timeout: 4000,
          shouldShowTimeoutProgress: true,
        });
        window.location.href = '/login';
      } finally {
        setIsLoading(false);
      }
    }
    validateToken();
  }, []);

  async function login(username: string, password: string) {
    const { access_token } = await authService.login({ username, password });
    localStorage.setItem(TOKEN_KEY, access_token);
    const me = await authService.getMe();
    setUser(me);
  }

  async function logout() {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem(TOKEN_KEY);
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