// src/components/auth/RegisterForm.tsx
import { useState } from 'react';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { addToast } from '@heroui/toast';
import { authService } from '@/services/authServices';
import { EyeIcon, EyeOffIcon, UserPlus } from 'lucide-react';

export function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleRegister() {
    if (!username || !password || !confirmPassword) {
      addToast({ timeout: 3000, shouldShowTimeoutProgress: true, title: 'Campos obrigatórios', description: 'Preencha todos os campos.', color: 'warning' });
      return;
    }
    if (password !== confirmPassword) {
      addToast({ timeout: 3000, shouldShowTimeoutProgress: true, title: 'Senhas diferentes', description: 'As senhas não coincidem.', color: 'warning' });
      return;
    }
    try {
      setIsLoading(true);
      await authService.register({ username, password });
      addToast({ timeout: 3000, shouldShowTimeoutProgress: true, title: 'Conta criada!', description: 'Redirecionando para o login...', color: 'success' });
      setTimeout(() => { window.location.href = '/login'; }, 1500);
    } catch {
      addToast({ timeout: 3000, shouldShowTimeoutProgress: true, title: 'Erro ao criar conta', description: 'Tente novamente mais tarde.', color: 'danger' });
    } finally {
      setIsLoading(false);
    }
  }

  const inputClasses = {
    input: 'bg-transparent text-white',
    inputWrapper: 'bg-white/5 border-white/10 hover:border-white/20 data-[focus=true]:border-primary',
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Usuário"
        placeholder="seu_usuario"
        value={username}
        onValueChange={setUsername}
        autoComplete="off"
        classNames={inputClasses}
      />

      <Input
        label="Senha"
        placeholder="••••••••"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onValueChange={setPassword}
        autoComplete="off"
        classNames={inputClasses}
        endContent={
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
            {showPassword ? <EyeOffIcon className="text-white/40" size={16} /> : <EyeIcon className="text-white/40" size={16} />}
          </button>
        }
      />

      <Input
        label="Confirmar senha"
        placeholder="••••••••"
        type={showConfirm ? 'text' : 'password'}
        value={confirmPassword}
        onValueChange={setConfirmPassword}
        autoComplete="off"
        classNames={inputClasses}
        endContent={
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="focus:outline-none">
            {showConfirm ? <EyeOffIcon className="text-white/40" size={16} /> : <EyeIcon className="text-white/40" size={16} />}
          </button>
        }
      />

      <Button
        color="primary"
        isLoading={isLoading}
        onPress={handleRegister}
        fullWidth
        className="font-semibold mt-2"
        endContent={!isLoading && <UserPlus size={16} />}
      >
        Criar conta
      </Button>

      <p className="text-center text-sm text-white/30">
        Já tem conta?{' '}
        <a href="/login" className="text-primary hover:text-primary/80 transition-colors">
          Entrar
        </a>
      </p>
    </div>
  );
}