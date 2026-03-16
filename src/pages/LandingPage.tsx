// src/pages/Landing.tsx
import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Image } from '@heroui/image';
import {
    Lock,
    Users,
    Shield,
    KeyRound,
    StickyNote,
    ArrowRight,
    Eye,
} from 'lucide-react';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }, // cubic bezier em vez de string
    },
};

const stagger = {
    visible: { transition: { staggerChildren: 0.15 } },
};

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <motion.div
            ref={ref}
            variants={stagger}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className={className}
        >
            {children}
        </motion.div>
    );
}

const features = [
    {
        icon: <StickyNote size={22} />,
        title: 'Notas organizadas',
        description: 'Crie e organize suas notas em tópicos. Encontre tudo rapidamente com busca e filtros.',
        color: '#006FEE',
    },
    {
        icon: <Lock size={22} />,
        title: 'Privacidade total',
        description: 'Tópicos privados visíveis apenas para membros que você convidar.',
        color: '#f5a524',
    },
    {
        icon: <KeyRound size={22} />,
        title: 'Criptografia forte',
        description: 'Escolha entre criptografia automática no servidor ou defina sua própria passphrase.',
        color: '#17c964',
    },
    {
        icon: <Users size={22} />,
        title: 'Colaboração',
        description: 'Convide membros para tópicos e colabore em tempo real com sua equipe.',
        color: '#9353d3',
    },
    {
        icon: <Shield size={22} />,
        title: 'Segurança em camadas',
        description: 'Autenticação por token, rotas protegidas e dados sempre criptografados em repouso.',
        color: '#f31260',
    },
    {
        icon: <Eye size={22} />,
        title: 'Controle de visibilidade',
        description: 'Defina cada tópico como público ou privado. Você decide quem vê o quê.',
        color: '#0070f3',
    },
];


export function LandingPage() {
    return (
        <div className="min-h-screen bg-black text-white">

            {/* NAVBAR */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-black/40 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-2">
                    <Image
                        alt="HeroUI hero Image"
                        src="/Anotaai.png"
                        width={40}
                    />
                    <span className="font-bold text-lg">Anota Aí</span>
                </div>
                <div className="flex gap-3">
                    <Button as="a" href="/login" variant="flat" size="sm" className="text-white/70">
                        Entrar
                    </Button>
                    <Button as="a" href="/register" color="primary" size="sm">
                        Criar conta
                    </Button>
                </div>
            </nav>

            {/* HERO */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Video background */}
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                >
                    <source src="/hero-bg.mp4" type="video/mp4" />
                </video>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="relative z-10 text-center px-6 max-w-4xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <Chip color="primary" variant="flat" className="mb-6">
                            Gestão de notas inteligente
                        </Chip>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.7 }}
                        className="text-5xl md:text-7xl font-black leading-tight mb-6"
                    >
                        Suas notas.
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                            Seu controle.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.7 }}
                        className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed"
                    >
                        Organize ideias em tópicos, proteja informações sensíveis com criptografia
                        e colabore com quem você escolher. Simples, seguro e poderoso.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.7 }}
                        className="flex gap-4 justify-center flex-wrap"
                    >
                        <Button
                            as="a"
                            href="/register"
                            color="primary"
                            size="lg"
                            endContent={<ArrowRight size={18} />}
                            className="font-semibold px-8"
                        >
                            Começar agora
                        </Button>
                        <Button
                            as="a"
                            href="/login"
                            variant="bordered"
                            size="lg"
                            className="font-semibold px-8 border-white/20 text-white/70 hover:border-white/50"
                        >
                            Já tenho conta
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
                    >
                        <div className="w-1 h-2 rounded-full bg-white/40" />
                    </motion.div>
                </motion.div>
            </section>

            {/* FEATURES */}
            <section className="py-32 px-6">
                <AnimatedSection className="max-w-6xl mx-auto">
                    <motion.div variants={fadeUp} className="text-center mb-16">
                        <Chip color="primary" variant="flat" className="mb-4">Funcionalidades</Chip>
                        <h2 className="text-4xl md:text-5xl font-black mb-4">
                            Tudo que você precisa
                        </h2>
                        <p className="text-white/50 text-lg max-w-xl mx-auto">
                            Uma plataforma completa para gerenciar suas notas com segurança e eficiência.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature) => (
                            <motion.div
                                key={feature.title}
                                variants={fadeUp}
                                className="group relative p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors overflow-hidden"
                            >
                                <div
                                    className="absolute bottom-0 left-0 right-0 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                    style={{ background: `linear-gradient(to top, ${feature.color}15, transparent)` }}
                                />
                                <div
                                    className="absolute bottom-0 left-0 right-0 h-0.5"
                                    style={{ background: feature.color, opacity: 0.4 }}
                                />

                                <div
                                    className="inline-flex p-3 rounded-xl mb-4"
                                    style={{ background: `${feature.color}20`, color: feature.color }}
                                >
                                    {feature.icon}
                                </div>
                                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                                <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </AnimatedSection>
            </section>

            {/* HOW IT WORKS */}
            <HowItWorksSection />


            {/* CTA FINAL */}
            <section className="py-32 px-6">
                <AnimatedSection className="max-w-3xl mx-auto text-center">
                    <motion.div variants={fadeUp}>
                        <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                            Pronto para organizar
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                                suas ideias?
                            </span>
                        </h2>
                        <p className="text-white/50 text-lg mb-10 max-w-lg mx-auto">
                            Crie sua conta gratuitamente e comece a usar agora mesmo.
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Button
                                as="a"
                                href="/register"
                                color="primary"
                                size="lg"
                                endContent={<ArrowRight size={18} />}
                                className="font-semibold px-10"
                            >
                                Criar conta grátis
                            </Button>
                            <Button
                                as="a"
                                href="/login"
                                variant="bordered"
                                size="lg"
                                className="font-semibold px-10 border-white/20 text-white/70"
                            >
                                Entrar
                            </Button>
                        </div>
                    </motion.div>
                </AnimatedSection>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-white/5 py-8 px-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <StickyNote size={16} className="text-primary" />
                    <span className="font-semibold">Anota Aí</span>
                </div>
                <p className="text-white/30 text-sm">Feito com React, HeroUI e Framer Motion.</p>
            </footer>

        </div>
    );
}