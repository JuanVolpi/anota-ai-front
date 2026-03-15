// src/pages/Login.tsx
import { LoginCard } from '@/components/auth/LoginCard';

export function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-black overflow-hidden">

      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      >
        <source src="/login-bg.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-black/80" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: '#006FEE' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: '#9353d3' }} />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm">
        <LoginCard />
      </div>

    </div>
  );
}