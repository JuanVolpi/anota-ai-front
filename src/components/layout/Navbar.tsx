// src/components/layout/Navbar.tsx
import { useState } from 'react';
import {
  Navbar, NavbarBrand, NavbarContent, NavbarItem,
} from '@heroui/navbar';
import { Button } from '@heroui/button';
import { Spinner } from '@heroui/spinner';
import { User } from '@heroui/user';
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
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.roles?.includes('ADMIN');
  console.log(user)
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

  return (
    <Navbar maxWidth="full" position="static" className="border-b border-divider">

      {/* Left: Logo + divider + User */}
      <NavbarBrand className="gap-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <Image
            alt="HeroUI hero Image"
            src="public/Anotaai.png"
            width={40}
          />
          <span className="text-base font-black tracking-tight">Anota Ai</span>
        </div>

        <div className="w-px h-6 bg-divider" />

        <div className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/profile')}>
          <User
            name={user?.username}
            description={isAdmin ? 'Admin' : 'Usuário'}
            avatarProps={{
              showFallback: true,
              name: user?.username?.charAt(0).toUpperCase(),
              className: 'w-7 h-7 text-xs bg-primary/20 text-primary font-bold',
            }}
            classNames={{
              name: 'font-semibold text-sm',
              description: 'text-xs text-default-400',
            }}
          />
        </div>
      </NavbarBrand>

      {/* Center: Nav links */}
      <NavbarContent className="gap-1" justify="center">
        {visibleLinks.map((link) => {
          const isActive = location.pathname.startsWith(link.path);
          const Icon = link.icon;
          return (
            <NavbarItem key={link.path} isActive={isActive}>
              <button
                onClick={() => navigate(link.path)}
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

      {/* Right: Theme + Logout */}
      <NavbarContent justify="end" className="gap-2">
        <NavbarItem>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            size="sm"
            variant="light"
            color="danger"
            onPress={handleLogout}
            isDisabled={isLoading}
            startContent={isLoading ? <Spinner size="sm" color="danger" /> : <LogOut size={15} />}
          >
            Sair
          </Button>
        </NavbarItem>
      </NavbarContent>

    </Navbar>
  );
}