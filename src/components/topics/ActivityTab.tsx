// src/components/topics/ActivityTab.tsx
import { useEffect, useState } from 'react';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Spinner } from '@heroui/spinner';
import { RefreshCw } from 'lucide-react';
import { topicService } from '@/services/topicServices';
import type { ActivityEvent } from '@/types/topicTypes';

interface Props { topicId: string; refreshKey?: number; }

function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'hoje';
    if (days === 1) return 'há 1 dia';
    return `há ${days} dias`;
}

const ACTION_LABELS: Record<ActivityEvent['action'], string> = {
    note_created: 'criou a nota',
    note_updated: 'editou a nota',
    note_deleted: 'deletou a nota',
    member_added: 'adicionou o membro',
    member_removed: 'removeu o membro',
    role_changed: 'atualizou a permissão de um membro',
    topic_updated: 'editou o tópico',
    topic_archived: 'arquivou o tópico',
    topic_restored: 'restaurou o tópico',
};

const ACTION_COLORS: Partial<Record<ActivityEvent['action'], 'success' | 'danger' | 'warning' | 'primary' | 'default'>> = {
    note_created: 'success',
    note_deleted: 'danger',
    member_removed: 'danger',
    topic_archived: 'warning',
    topic_restored: 'success',
    role_changed: 'primary',
};

export function ActivityTab({ topicId, refreshKey = 0 }: Props) {
    const [events, setEvents] = useState<ActivityEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    async function load() {
        try {
            setIsLoading(true);
            const data = await topicService.getActivity(topicId);
            setEvents(data);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => { load(); }, [topicId, refreshKey]);

    if (isLoading) return <div className="flex justify-center py-6"><Spinner size="sm" /></div>;

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-default-500">{events.length} evento{events.length !== 1 ? 's' : ''}</p>
                <Button isIconOnly size="sm" variant="flat" onPress={load}>
                    <RefreshCw size={13} />
                </Button>
            </div>

            {events.length === 0 ? (
                <p className="text-sm text-default-400 py-2">Nenhuma atividade registada.</p>
            ) : (
                <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-1">
                    {events.map((event) => (
                        <div key={event.id} className="flex items-center justify-between gap-3 py-2 px-3 rounded-lg hover:bg-default-100/50 transition-colors">
                            <p className="text-sm">
                                <span className="font-semibold text-primary">{event.username}</span>
                                {' '}
                                <span className="text-default-500">{ACTION_LABELS[event.action]}</span>
                                {event.metadata?.noteTitle && (
                                    <span className="font-medium"> "{event.metadata.noteTitle}"</span>
                                )}
                                {event.metadata?.memberUsername && (
                                    <span className="font-medium text-primary"> {event.metadata.memberUsername}</span>
                                )}
                            </p>
                            <div className="flex items-center gap-2 shrink-0">
                                {ACTION_COLORS[event.action] && (
                                    <Chip size="sm" variant="dot" color={ACTION_COLORS[event.action]} className="hidden sm:flex" />
                                )}
                                <span className="text-xs text-default-400 whitespace-nowrap">{timeAgo(event.created_at)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}