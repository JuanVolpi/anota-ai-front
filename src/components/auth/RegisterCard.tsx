// src/components/auth/RegisterCard.tsx
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from './RegisterForm';
import { Button, Tooltip, Image } from '@heroui/react';

export function RegisterCard() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl"
    >
      <Tooltip content="Voltar para Home">
        <Button onPress={() => navigate("/")} isIconOnly className={'absolute'} variant='light'><ChevronLeft size={16} /></Button>
      </Tooltip>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex items-center gap-2 mb-2 justify-center cursor-pointer"
        onClick={() => navigate('/')}
      >
        <div className='flex flex-col justify-center items-center gap-1'>
          <Image
            alt="Anota aí logo"
            src="/Anotaai.png"
            width={50}
          />
          <span className="font-bold text-white">Anota Aí</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-black text-white mb-1">Criar conta</h1>
        <p className="text-sm text-white/40">Preencha os dados para se registrar</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <RegisterForm />
      </motion.div>
    </motion.div >
  );
}