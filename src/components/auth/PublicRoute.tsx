// src/components/auth/PublicRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from '@heroui/spinner';
import { useAuth } from '@/contexts/AuthContext';

export function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/topics" replace /> : <Outlet />;
}