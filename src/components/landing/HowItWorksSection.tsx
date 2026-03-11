// src/components/landing/HowItWorksSection.tsx
import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, FolderPlus, FileText, Users } from 'lucide-react';

const steps = [
    {
        number: '01',
        icon: <UserPlus size={28} />,
        title: 'Crie sua conta',
        description: 'Registro rápido com usuário e senha segura. Em segundos você já está dentro da plataforma.',
        color: '#006FEE',
        image: '/steps/step-01.png',
    },
    {
        number: '02',
        icon: <FolderPlus size={28} />,
        title: 'Crie um tópico',
        description: 'Organize suas notas em tópicos públicos ou privados. Defina criptografia e controle quem acessa.',
        color: '#f5a524',
        image: '/steps/step-02.png',
    },
    {
        number: '03',
        icon: <FileText size={28} />,
        title: 'Adicione notas',
        description: 'Escreva, edite e gerencie suas notas dentro de cada tópico. Busca rápida e organização visual.',
        color: '#17c964',
        image: '/steps/step-03.png',
    },
    {
        number: '04',
        icon: <Users size={28} />,
        title: 'Convide membros',
        description: 'Compartilhe tópicos privados com quem você escolher usando o ID público do usuário.',
        color: '#9353d3',
        image: '/steps/step-04.png',
    },
];

export function HowItWorksSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const containerHeight = containerRef.current.offsetHeight;
            const windowHeight = window.innerHeight;

            // quanto do container já foi scrollado (0 a 1)
            const scrolled = -rect.top / (containerHeight - windowHeight);
            const clamped = Math.max(0, Math.min(1, scrolled));

            // divide em 4 partes iguais
            const step = Math.min(
                steps.length - 1,
                Math.floor(clamped * steps.length)
            );

            setActiveStep(step);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const activeColor = steps[activeStep].color;

    return (
        <section
            ref={containerRef}
            className="relative"
            style={{ height: `${steps.length * 100}vh` }}
        >
            {/* Sticky panel */}
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">

                {/* Background glow */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{ opacity: 1 }}
                    key={activeStep}
                >
                    <motion.div
                        className="absolute inset-0 opacity-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.1 }}
                        transition={{ duration: 0.6 }}
                        style={{
                            background: `radial-gradient(ellipse at center, ${activeColor}, transparent 70%)`,
                        }}
                    />
                </motion.div>

                {/* Header */}
                <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center z-10">
                    <p className="text-white/30 text-sm uppercase tracking-widest">Como funciona</p>
                </div>

                {/* Content */}
                <div className="relative z-10 w-full max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left — text */}
                    <div className="relative h-72">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                className="absolute inset-0 flex flex-col justify-center"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div
                                        className="p-3 rounded-xl"
                                        style={{
                                            background: `${activeColor}20`,
                                            color: activeColor,
                                        }}
                                    >
                                        {steps[activeStep].icon}
                                    </div>
                                    <span
                                        className="text-7xl font-black"
                                        style={{ color: activeColor, opacity: 0.15 }}
                                    >
                                        {steps[activeStep].number}
                                    </span>
                                </div>

                                <h3 className="text-4xl md:text-5xl font-black mb-4">
                                    {steps[activeStep].title}
                                </h3>
                                <p className="text-white/50 text-lg leading-relaxed max-w-md">
                                    {steps[activeStep].description}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right — image */}
                    <div className="relative h-80">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, scale: 0.93 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.03 }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                className="absolute inset-0 rounded-2xl border border-white/10 overflow-hidden"
                            >
                                <img
                                    src={steps[activeStep].image}
                                    alt={steps[activeStep].title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                                {/* Fallback */}
                                <div
                                    className="absolute inset-0 flex items-center justify-center"
                                    style={{ background: `${activeColor}10` }}
                                >
                                    {steps[activeStep].image ? <></> : <div
                                        className="p-10 rounded-2xl"
                                        style={{ background: `${activeColor}15`, color: activeColor }}
                                    >
                                        {steps[activeStep].icon}
                                    </div>}

                                </div>
                                {/* Gradient overlay */}
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background: `linear-gradient(to top, ${activeColor}30, transparent)`,
                                    }}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Progress dots */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: i === activeStep ? 1.4 : 1,
                                opacity: i === activeStep ? 1 : 0.3,
                            }}
                            transition={{ duration: 0.3 }}
                            className="w-2 h-2 rounded-full cursor-pointer"
                            style={{ backgroundColor: i === activeStep ? step.color : 'white' }}
                            onClick={() => {
                                if (!containerRef.current) return;
                                const containerTop = containerRef.current.offsetTop;
                                const containerHeight = containerRef.current.offsetHeight;
                                const windowHeight = window.innerHeight;
                                const scrollTarget =
                                    containerTop + (i / steps.length) * (containerHeight - windowHeight);
                                window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
                            }}
                        />
                    ))}
                </div>

                {/* Bottom progress bar */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            animate={{ width: i === activeStep ? 32 : 8 }}
                            transition={{ duration: 0.3 }}
                            className="h-1 rounded-full"
                            style={{
                                backgroundColor: i === activeStep ? step.color : 'rgba(255,255,255,0.2)',
                            }}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}