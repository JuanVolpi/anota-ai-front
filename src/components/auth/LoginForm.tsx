// src/components/auth/LoginForm.tsx
import { useState } from 'react';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { addToast } from '@heroui/toast';
import { useAuth } from '@/contexts/AuthContext';
import { EyeIcon, EyeOffIcon, LogIn } from 'lucide-react';

export function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  async function handleLogin() {
    if (!username || !password) {
      addToast({
        timeout: 3000,
        shouldShowTimeoutProgress: true,
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos.',
        color: 'warning',
      });
      return;
    }
    try {
      setIsLoading(true);
      await login(username, password);
      window.location.href = '/topics';
    } catch {
      addToast({
        timeout: 3000,
        shouldShowTimeoutProgress: true,
        title: 'Erro ao entrar',
        description: 'Usuário ou senha inválidos.',
        color: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Usuário"
        placeholder="seu_usuario"
        value={username}
        onValueChange={setUsername}
        autoComplete="off"
        classNames={{
          input: 'bg-transparent text-white',
          inputWrapper: 'bg-white/5 border-white/10 hover:border-white/20 data-[focus=true]:border-primary',
        }}
      />

      <Input
        label="Senha"
        placeholder="••••••••"
        type={isVisible ? 'text' : 'password'}
        value={password}
        onValueChange={setPassword}
        autoComplete="off"
        classNames={{
          input: 'bg-transparent text-white',
          inputWrapper: 'bg-white/5 border-white/10 hover:border-white/20 data-[focus=true]:border-primary',
        }}
        endContent={
          <button
            aria-label="toggle password visibility"
            className="focus:outline-none"
            type="button"
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible
              ? <EyeOffIcon className="text-white/40" size={16} />
              : <EyeIcon className="text-white/40" size={16} />
            }
          </button>
        }
      />

      <Button
        color="primary"
        isLoading={isLoading}
        onPress={handleLogin}
        fullWidth
        className="font-semibold mt-2"
        endContent={!isLoading && <LogIn size={16} />}
      >
        Entrar
      </Button>

      <p className="text-center text-sm text-white/30">
        Não tem conta?{' '}
        <a href="/register" className="text-primary hover:text-primary/80 transition-colors">
          Criar conta
        </a>
      </p>
    </div>
  );
}
