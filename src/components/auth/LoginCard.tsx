// src/components/auth/LoginCard.tsx
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { useNavigate } from 'react-router-dom';
import { Button, Tooltip, Image } from '@heroui/react';

export function LoginCard() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl"
    >
      <Tooltip content="Voltar para Home">
        <Button isIconOnly onPress={() => navigate("/")} className={'absolute'} variant='light'><ChevronLeft size={16} /></Button>
      </Tooltip>
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex items-center gap-2 mb-8 justify-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <Image
          alt="HeroUI hero Image"
          src="/Anotaai.png"
          width={40}
        />
        <span className="font-bold text-white">Anota Ai</span>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-black text-white mb-1">Entrar</h1>
        <p className="text-sm text-white/40">Acesse sua conta para continuar</p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <LoginForm />
      </motion.div>
    </motion.div>
  );
}