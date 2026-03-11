// src/components/layout/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import { AppNavbar } from './Navbar';

export function MainLayout() {
  return (
    <div className="flex flex-col h-screen">
      <AppNavbar />
      <div className="flex flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}