import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Spinner } from '@heroui/spinner';
import { addToast } from '@heroui/toast';
import { Monitor, Trash2, LogOut } from 'lucide-react';
import { authService, } from '@/services/authServices';
import type { Session } from '@/types/authTypes';

function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'agora mesmo';
    if (mins < 60) return `há ${mins} min`;
    if (hours < 24) return `há ${hours}h`;
    return `há ${days} dias`;
}

function formatExpiry(date: string) {
    return new Date(date).toLocaleString('pt-PT', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

export function SessionsCard() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [revokingId, setRevokingId] = useState<string | null>(null);
    const [isRevokingAll, setIsRevokingAll] = useState(false);

    useEffect(() => { load(); }, []);

    async function load() {
        try {
            setIsLoading(true);
            const data = await authService.getSessions();
            setSessions(data);
        } catch {
            addToast({ title: 'Erro ao carregar sessões', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        } finally {
            setIsLoading(false);
        }
    }

    async function handleRevoke(session: Session) {
        try {
            setRevokingId(session.id);
            await authService.revokeSession(session.id);
            setSessions((prev) => prev.filter((s) => s.id !== session.id));
            addToast({ title: 'Sessão revogada!', color: 'success', timeout: 3000, shouldShowTimeoutProgress: true });
        } catch {
            addToast({ title: 'Erro ao revogar sessão', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        } finally {
            setRevokingId(null);
        }
    }

    async function handleRevokeAll() {
        try {
            setIsRevokingAll(true);
            await authService.revokeAllSessions();
            addToast({ title: 'Todas as sessões revogadas!', color: 'success', timeout: 3000, shouldShowTimeoutProgress: true });
            window.location.href = '/login';
        } catch {
            addToast({ title: 'Erro ao revogar sessões', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        } finally {
            setIsRevokingAll(false);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-divider p-6 flex flex-col gap-4"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Monitor size={18} className="text-default-500" />
                    <div>
                        <p className="font-semibold">Sessões ativas</p>
                        <p className="text-xs text-default-400">Dispositivos onde a tua conta está ligada.</p>
                    </div>
                </div>
                <Button
                    size="sm" variant="flat" color="danger"
                    startContent={<LogOut size={14} />}
                    onPress={handleRevokeAll}
                    isLoading={isRevokingAll}
                >
                    Revogar todas
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-4"><Spinner size="sm" /></div>
            ) : sessions.length === 0 ? (
                <p className="text-sm text-default-400">Nenhuma sessão ativa.</p>
            ) : (
                <div className="flex flex-col gap-2">
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-colors ${session.is_current ? 'border-primary/30 bg-primary/5' : 'border-divider bg-default-50 dark:bg-default-100/5'}`}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={`p-2 rounded-lg shrink-0 ${session.is_current ? 'bg-primary/10' : 'bg-default-100'}`}>
                                    <Monitor size={14} className={session.is_current ? 'text-primary' : 'text-default-400'} />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium truncate">{session.username}</p>
                                        {session.is_current && (
                                            <Chip size="sm" variant="flat" color="primary">atual</Chip>
                                        )}
                                    </div>
                                    <p className="text-xs text-default-400">
                                        Criada {timeAgo(session.created_at)} · Expira {formatExpiry(session.expires_at)}
                                    </p>
                                </div>
                            </div>

                            {!session.is_current && (
                                <Button
                                    isIconOnly size="sm" variant="flat" color="danger"
                                    isLoading={revokingId === session.id}
                                    onPress={() => handleRevoke(session)}
                                >
                                    <Trash2 size={13} />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}