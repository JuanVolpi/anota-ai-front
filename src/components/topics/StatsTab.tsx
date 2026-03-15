// src/components/topics/StatsTab.tsx
import { useEffect, useState } from 'react';
import { Card, CardBody } from '@heroui/card';
import { Spinner } from '@heroui/spinner';
import { FileText, ThumbsUp, ThumbsDown, Users, Activity } from 'lucide-react';
import { topicService } from '@/services/topicServices';
import type { TopicStats } from '@/types/topicTypes';

interface Props { topicId: string; refreshKey?: number; }

function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'hoje';
    if (days === 1) return 'há 1 dia';
    return `há ${days} dias`;
}

const STAT_CARDS = (stats: TopicStats) => [
    { label: 'Notas', value: stats.total_notes, icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Curtidas', value: stats.total_up_votes, icon: ThumbsUp, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Negativas', value: stats.total_down_votes, icon: ThumbsDown, color: 'text-danger', bg: 'bg-danger/10' },
    { label: 'Membros', value: stats.total_members, icon: Users, color: 'text-default-500', bg: 'bg-default-100' },
    {
        label: 'Última atividade',
        value: stats.last_activity_at ? timeAgo(stats.last_activity_at) : '—',
        icon: Activity,
        color: 'text-warning',
        bg: 'bg-warning/10',
        wide: true,
    },
];

export function StatsTab({ topicId, refreshKey = 0 }: Props) {
    const [stats, setStats] = useState<TopicStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        topicService.getStats(topicId)
            .then(setStats)
            .finally(() => setIsLoading(false));
    }, [topicId, refreshKey]);

    if (isLoading) return <div className="flex justify-center py-6"><Spinner size="sm" /></div>;
    if (!stats) return <p className="text-sm text-default-400">Não foi possível carregar estatísticas.</p>;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {STAT_CARDS(stats).map((card) => {
                const Icon = card.icon;
                return (
                    <Card
                        key={card.label}
                        className={`border border-divider shadow-none ${card.wide ? 'col-span-2' : ''}`}
                        shadow="none"
                    >
                        <CardBody className="flex flex-row items-center gap-3 p-4">
                            <div className={`p-2 rounded-lg ${card.bg} shrink-0`}>
                                <Icon size={16} className={card.color} />
                            </div>
                            <div>
                                <p className="text-xs text-default-400">{card.label}</p>
                                <p className="text-xl font-black">{card.value}</p>
                            </div>
                        </CardBody>
                    </Card>
                );
            })}
        </div>
    );
}