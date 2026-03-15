// src/components/layout/Navbar.tsx
import { useState } from 'react';
import {
  Navbar, NavbarBrand, NavbarContent, NavbarItem,
  NavbarMenuToggle, NavbarMenu, NavbarMenuItem,
} from '@heroui/navbar';
import { Button } from '@heroui/button';
import { Spinner } from '@heroui/spinner';
import { Avatar } from '@heroui/avatar';
import { Image } from '@heroui/image';
import { addToast } from '@heroui/toast';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Moon, Sun, ShieldCheck, BookOpen } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Tópicos', path: '/topics', icon: BookOpen },
  { label: 'Admin', path: '/admin', icon: ShieldCheck, adminOnly: true },
];

export function AppNavbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.roles?.includes('ADMIN');
  const visibleLinks = NAV_LINKS.filter((l) => !l.adminOnly || isAdmin);

  async function handleLogout() {
    try {
      setIsLoading(true);
      await logout();
      window.location.href = '/login';
    } catch {
      addToast({ title: 'Erro ao sair', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
    } finally {
      setIsLoading(false);
    }
  }

  function handleNavigate(path: string) {
    navigate(path);
    setIsMenuOpen(false);
  }

  return (
    <Navbar
      maxWidth="full"
      position="static"
      className="border-b border-divider"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Left: Hamburger (mobile) + Logo */}
      <NavbarContent justify="start">
        <NavbarMenuToggle className="sm:hidden" />

        <NavbarBrand className="gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate('/')}>
            <Image alt="Anota Ai" src="/Anotaai.png" width={32} />
            <span className="text-base font-black tracking-tight">Anota Ai</span>
          </div>
        </NavbarBrand>
      </NavbarContent>

      {/* Center: Nav links (desktop only) */}
      <NavbarContent className="hidden sm:flex gap-1" justify="center">
        {visibleLinks.map((link) => {
          const isActive = location.pathname.startsWith(link.path);
          const Icon = link.icon;
          return (
            <NavbarItem key={link.path}>
              <button
                onClick={() => handleNavigate(link.path)}
                className={`
                  flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-default-500 hover:text-foreground hover:bg-default-100'
                  }
                `}
              >
                <Icon size={14} />
                {link.label}
              </button>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      {/* Right: Avatar + Theme + Logout */}
      <NavbarContent justify="end" className="gap-2">
        {/* Avatar → profile (desktop) */}
        <NavbarItem className="hidden sm:flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleNavigate('/profile')}>
          <Avatar
            showFallback
            name={user?.username?.charAt(0).toUpperCase()}
            className="w-7 h-7 text-xs bg-primary/20 text-primary font-bold"
          />
          <div className="hidden md:flex flex-col leading-tight">
            <span className="text-sm font-semibold">{user?.username}</span>
            <span className="text-xs text-default-400">{isAdmin ? 'Admin' : 'Usuário'}</span>
          </div>
        </NavbarItem>

        <NavbarItem>
          <Button
            isIconOnly size="sm" variant="flat"
            onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </Button>
        </NavbarItem>

        <NavbarItem className="hidden sm:flex">
          <Button
            size="sm" variant="light" color="danger"
            onPress={handleLogout}
            isDisabled={isLoading}
            startContent={isLoading ? <Spinner size="sm" color="danger" /> : <LogOut size={15} />}
          >
            Sair
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu className="pt-4 gap-2">
        {/* User info */}
        <NavbarMenuItem>
          <div
            className="flex items-center gap-3 p-3 rounded-xl border border-divider cursor-pointer hover:bg-default-100 transition-colors"
            onClick={() => handleNavigate('/profile')}
          >
            <Avatar
              showFallback
              name={user?.username?.charAt(0).toUpperCase()}
              className="w-9 h-9 bg-primary/20 text-primary font-bold"
            />
            <div>
              <p className="font-semibold text-sm">{user?.username}</p>
              <p className="text-xs text-default-400">{isAdmin ? 'Admin' : 'Usuário'}</p>
            </div>
          </div>
        </NavbarMenuItem>

        {/* Nav links */}
        {visibleLinks.map((link) => {
          const isActive = location.pathname.startsWith(link.path);
          const Icon = link.icon;
          return (
            <NavbarMenuItem key={link.path}>
              <button
                onClick={() => handleNavigate(link.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-default-500 hover:text-foreground hover:bg-default-100'
                  }
                `}
              >
                <Icon size={16} />
                {link.label}
              </button>
            </NavbarMenuItem>
          );
        })}

        {/* Logout */}
        <NavbarMenuItem className="mt-auto pt-4 border-t border-divider">
          <Button
            fullWidth variant="flat" color="danger"
            onPress={handleLogout}
            isDisabled={isLoading}
            startContent={isLoading ? <Spinner size="sm" color="danger" /> : <LogOut size={15} />}
          >
            Sair
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}