// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from 'react';
import type { AuthContextData, User } from '@/types/authTypes';
import { authService } from '@/services/authServices';
import { addToast } from '@heroui/toast';

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function validateSession() {
      try {
        const me = await authService.getMe();
        setUser(me);
        scheduleRefresh(me.expires_at);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    validateSession();

    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);

  function scheduleRefresh(expiresAt: string) {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    const expiresMs = new Date(expiresAt).getTime();
    const now = Date.now();
    // renova 2 minutos antes de expirar
    const delay = expiresMs - now - 2 * 60 * 1000;

    if (delay <= 0) return;

    refreshTimerRef.current = setTimeout(async () => {
      try {
        await authService.refresh();
        const me = await authService.getMe();
        setUser(me);
        scheduleRefresh(me.expires_at); // agenda próximo refresh
      } catch {
        setUser(null);
        addToast({
          title: 'Sessão expirada',
          description: 'Faça login novamente.',
          color: 'warning',
          timeout: 4000,
          shouldShowTimeoutProgress: true,
        });
        window.location.href = '/login';
      }
    }, delay);
  }

  async function login(username: string, password: string) {
    await authService.login({ username, password });
    const me = await authService.getMe();
    setUser(me);
    scheduleRefresh(me.expires_at);
  }

  async function logout() {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
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