// src/components/layout/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import { AppNavbar } from './Navbar';

export function MainLayout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AppNavbar />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}