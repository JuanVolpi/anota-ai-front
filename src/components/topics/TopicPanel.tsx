// src/components/topics/TopicPanel.tsx
import { useState } from 'react';
import { Tabs, Tab } from '@heroui/tabs';
import { Users, BarChart2, Activity } from 'lucide-react';
import { MembersTab } from './MembersTab';
import { StatsTab } from './StatsTab';
import { ActivityTab } from './ActivityTab';
import type { TopicMember, TopicStats, ActivityEvent } from '@/types/topicTypes';

interface Props {
    topicId: string;
    ownerId: string;
    isOwner: boolean;
    members: TopicMember[];
    onMembersChanged: (members: TopicMember[]) => void;
    refreshKey?: number;
}

export function TopicPanel({ topicId, ownerId, isOwner, members, onMembersChanged, refreshKey = 0 }: Props) {
    const [tab, setTab] = useState('members');

    return (
        <div className="mx-6 mt-4 rounded-2xl border border-divider overflow-hidden">
            <Tabs
                selectedKey={tab}
                onSelectionChange={(k) => setTab(k as string)}
                variant="underlined"
                classNames={{
                    base: 'w-full border-b border-divider px-4 bg-default-50 dark:bg-default-100/5',
                    tabList: 'gap-4',
                    tab: 'py-3',
                    cursor: 'bg-primary',
                }}
            >
                <Tab
                    key="members"
                    title={
                        <div className="flex items-center gap-1.5">
                            <Users size={14} />
                            <span>Membros</span>
                            <span className="text-xs text-default-400">({members.length})</span>
                        </div>
                    }
                >
                    <div className="p-4">
                        <MembersTab
                            topicId={topicId}
                            ownerId={ownerId}
                            isOwner={isOwner}
                            members={members}
                            onMembersChanged={onMembersChanged}
                        />
                    </div>
                </Tab>

                <Tab
                    key="stats"
                    title={
                        <div className="flex items-center gap-1.5">
                            <BarChart2 size={14} />
                            <span>Estatísticas</span>
                        </div>
                    }
                >
                    <div className="p-4">
                        <StatsTab topicId={topicId} refreshKey={refreshKey} />
                    </div>
                </Tab>

                <Tab
                    key="activity"
                    title={
                        <div className="flex items-center gap-1.5">
                            <Activity size={14} />
                            <span>Atividades</span>
                        </div>
                    }
                >
                    <div className="p-4">
                        <ActivityTab topicId={topicId} refreshKey={refreshKey} />
                    </div>
                </Tab>
            </Tabs>
        </div>
    );
}