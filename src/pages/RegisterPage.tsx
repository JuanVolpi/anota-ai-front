// src/pages/Register.tsx
import { RegisterCard } from '@/components/auth/RegisterCard';

export function RegisterPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-black overflow-hidden">
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-30">
        <source src="/login-bg.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-black/80" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: '#006FEE' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: '#9353d3' }} />
      <div className="relative z-10 w-full max-w-sm">
        <RegisterCard />
      </div>
    </div>
  );
}