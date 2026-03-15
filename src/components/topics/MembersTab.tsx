// src/components/topics/MembersTab.tsx
import { useState } from 'react';
import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Tooltip } from '@heroui/tooltip';
import { Select, SelectItem } from '@heroui/select';
import { addToast } from '@heroui/toast';
import { UserPlus, X, Crown } from 'lucide-react';
import { topicService } from '@/services/topicServices';
import { InviteMemberModal } from './InviteMemberModal';
import type { TopicMember } from '@/types/topicTypes';

interface Props {
    topicId: string;
    ownerId: string;
    ownerUsername: string;
    isOwner: boolean;
    members: TopicMember[];
    onMembersChanged: (members: TopicMember[]) => void;
}

export function MembersTab({ topicId, ownerId, ownerUsername, isOwner, members, onMembersChanged }: Props) {
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    async function handleRemove(member: TopicMember) {
        try {
            setRemovingId(member.id);
            await topicService.removeMember(topicId, member.public_id);
            onMembersChanged(members.filter((m) => m.id !== member.id));
            addToast({ title: 'Membro removido!', color: 'success', timeout: 3000, shouldShowTimeoutProgress: true });
        } catch {
            addToast({ title: 'Erro ao remover membro', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        } finally {
            setRemovingId(null);
        }
    }

    async function handleRoleChange(member: TopicMember, role: 'read' | 'write') {
        try {
            setUpdatingId(member.id);
            await topicService.updateMemberRole(topicId, member.public_id, role);
            onMembersChanged(members.map((m) => m.id === member.id ? { ...m, role } : m));
            addToast({ title: 'Permissão atualizada!', color: 'success', timeout: 3000, shouldShowTimeoutProgress: true });
        } catch {
            addToast({ title: 'Erro ao atualizar permissão', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        } finally {
            setUpdatingId(null);
        }
    }

    const totalCount = members.length + 1; // +1 pelo dono

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-default-500">
                    {totalCount} membro{totalCount !== 1 ? 's' : ''}
                </p>
                {isOwner && (
                    <Button size="sm" variant="flat" color="primary" startContent={<UserPlus size={14} />} onPress={() => setIsInviteOpen(true)}>
                        Convidar
                    </Button>
                )}
            </div>

            <div className="flex flex-col gap-2">
                {/* Dono — sempre primeiro */}
                <div className="flex items-center gap-3 p-3 rounded-xl border border-warning/30 bg-warning/5">
                    <Avatar
                        showFallback
                        name={ownerUsername.charAt(0).toUpperCase()}
                        className="w-8 h-8 text-sm font-bold bg-warning/20 text-warning shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold truncate">{ownerUsername}</p>
                            <Chip size="sm" variant="flat" color="warning" startContent={<Crown size={10} />}>
                                dono
                            </Chip>
                        </div>
                    </div>
                </div>

                {/* Membros convidados */}
                {members.length === 0 ? (
                    <p className="text-sm text-default-400 py-2">Nenhum membro convidado ainda.</p>
                ) : (
                    members.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center gap-3 p-3 rounded-xl border border-divider bg-default-50 dark:bg-default-100/5"
                        >
                            <Avatar
                                showFallback
                                name={member.username.charAt(0).toUpperCase()}
                                className="w-8 h-8 text-sm font-bold bg-primary/20 text-primary shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{member.username}</p>
                                <p className="text-xs text-default-400 font-mono">{member.public_id}</p>
                            </div>

                            {isOwner ? (
                                <div className="flex items-center gap-2 shrink-0">
                                    <Select
                                        size="sm"
                                        selectedKeys={[member.role ?? 'write']}
                                        onSelectionChange={(keys) => handleRoleChange(member, [...keys][0] as 'read' | 'write')}
                                        isDisabled={updatingId === member.id}
                                        className="w-28"
                                        aria-label="Permissão"
                                    >
                                        <SelectItem key="write">Escrita</SelectItem>
                                        <SelectItem key="read">Leitura</SelectItem>
                                    </Select>
                                    <Tooltip content="Remover membro" color="danger">
                                        <Button
                                            isIconOnly size="sm" variant="flat" color="danger"
                                            isLoading={removingId === member.id}
                                            onPress={() => handleRemove(member)}
                                        >
                                            <X size={13} />
                                        </Button>
                                    </Tooltip>
                                </div>
                            ) : (
                                member.role && (
                                    <Chip size="sm" variant="flat" color={member.role === 'write' ? 'success' : 'default'}>
                                        {member.role === 'write' ? 'Escrita' : 'Leitura'}
                                    </Chip>
                                )
                            )}
                        </div>
                    ))
                )}
            </div>

            <InviteMemberModal
                isOpen={isInviteOpen}
                topicId={topicId}
                onClose={() => setIsInviteOpen(false)}
                onInvited={() => setIsInviteOpen(false)}
            />
        </div>
    );
}