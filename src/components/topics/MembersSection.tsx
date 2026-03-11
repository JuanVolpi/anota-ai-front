import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Tooltip } from '@heroui/tooltip';
import { addToast } from '@heroui/toast';
import { UserPlus, X, Users } from 'lucide-react';
import { topicService } from '@/services/topicServices';
import type { TopicMember } from '@/types/topicTypes';
import { useState } from 'react';

interface Props {
    topicId: string;
    members: TopicMember[];
    isOwner: boolean;
    ownerId: string;
    onInviteClick: () => void;
    onMemberRemoved: (memberId: string) => void;
}

export function MembersSection({ topicId, members, isOwner, ownerId, onInviteClick, onMemberRemoved }: Props) {
    const [removingId, setRemovingId] = useState<string | null>(null);

    async function handleRemove(memberId: string) {
        try {
            setRemovingId(memberId);
            await topicService.removeMember(topicId, memberId);
            onMemberRemoved(memberId);
            addToast({ title: 'Membro removido!', color: 'success', timeout: 3000, shouldShowTimeoutProgress: true });
        } catch {
            addToast({ title: 'Erro ao remover membro', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        } finally {
            setRemovingId(null);
        }
    }

    return (
        <div className="mx-6 mt-4 rounded-xl border border-divider p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users size={16} className="text-default-400" />
                    <span className="font-semibold text-sm">Membros</span>
                    <Chip size="sm" variant="flat">{members.length}</Chip>
                </div>
                {isOwner && (
                    <Button size="sm" variant="flat" startContent={<UserPlus size={14} />} onPress={onInviteClick}>
                        Convidar
                    </Button>
                )}
            </div>

            {members.length === 0 ? (
                <p className="text-xs text-default-400">Nenhum membro convidado ainda.</p>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {members.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center gap-2 px-2 py-1 rounded-lg bg-default-100 border border-divider"
                        >
                            <Avatar
                                name={member.username.charAt(0).toUpperCase()}
                                className="w-6 h-6 text-xs bg-primary/20 text-primary font-bold"
                                showFallback
                            />
                            <span className="text-xs font-medium">{member.username}</span>
                            {member.id === ownerId ? (
                                <Chip size="sm" variant="flat" color="primary" className="text-xs h-4">dono</Chip>
                            ) : isOwner ? (
                                <Tooltip content="Remover membro" color="danger">
                                    <button
                                        onClick={() => handleRemove(member.id)}
                                        disabled={removingId === member.id}
                                        className="text-default-400 hover:text-danger transition-colors disabled:opacity-50"
                                    >
                                        <X size={12} />
                                    </button>
                                </Tooltip>
                            ) : null}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}