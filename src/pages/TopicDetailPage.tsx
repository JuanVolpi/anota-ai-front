// src/pages/TopicDetailPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Spinner } from '@heroui/spinner';
import { Chip } from '@heroui/chip';
import { addToast } from '@heroui/toast';
import { ArrowLeft, Plus, RefreshCw, Search, Lock, Globe } from 'lucide-react';
import { topicService } from '@/services/topicServices';
import { useAuth } from '@/contexts/AuthContext';
import { NoteCard } from '@/components/notes/NoteCard';
import { CreateNoteModal } from '@/components/notes/CreateNoteModal';
import { EditNoteModal } from '@/components/notes/EditNoteModal';
import { DeleteNoteModal } from '@/components/notes/DeleteNoteModal';
import type { TopicDetail, Note, TopicMember } from '@/types/topicTypes';
import { MembersSection } from '@/components/topics/MembersSection';
import { InviteMemberModal } from '@/components/topics/InviteMemberModal';

export function TopicDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [topic, setTopic] = useState<TopicDetail | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<'recent' | 'oldest' | 'top'>('recent');

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editNote, setEditNote] = useState<Note | null>(null);
    const [deleteNote, setDeleteNote] = useState<Note | null>(null);

    const [members, setMembers] = useState<TopicMember[]>([]);
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    useEffect(() => {
        if (id) load();
    }, [id]);

    async function load() {
        try {
            setIsLoading(true);
            const data = await topicService.getById(id!);
            setTopic(data);
            setMembers(Array.isArray(data.members) ? data.members : []);
            setNotes(Array.isArray(data.notes) ? data.notes : []);
        } catch {
            addToast({ title: 'Erro ao carregar tópico', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        } finally {
            setIsLoading(false);
        }
    }

    const filtered = notes
        .filter((n) => n.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sort === 'recent') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            if (sort === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            return ((b.up_votes?.length ?? 0) - (b.down_votes?.length ?? 0)) - ((a.up_votes?.length ?? 0) - (a.down_votes?.length ?? 0));
        });

    const isOwner = topic?.owner_id === user?.user_id;
    const isPrivate = topic?.visibility === 'private';

    if (isLoading) {
        return (
            <div className="flex flex-1 items-center justify-center h-full">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!topic) return null;

    return (
        <div className="flex flex-col flex-1 overflow-hidden">

            {/* Header */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-divider">
                <Button isIconOnly variant="flat" size="sm" onPress={() => navigate('/topics')}>
                    <ArrowLeft size={16} />
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        {isPrivate ? <Lock size={16} className="text-warning" /> : <Globe size={16} className="text-primary" />}
                        <h2 className="text-xl font-bold">{topic.title}</h2>
                        <Chip size="sm" variant="flat" color={isOwner ? 'primary' : 'default'}>
                            {isOwner ? 'Dono' : 'Membro'}
                        </Chip>
                    </div>
                    {topic.description && <p className="text-sm text-default-400 mt-0.5">{topic.description}</p>}
                    <p className="text-xs text-default-300 mt-0.5">{notes.length} nota{notes.length !== 1 ? 's' : ''} neste tópico</p>
                </div>
                <div className="flex gap-2">
                    <Button isIconOnly variant="flat" size="sm" onPress={load}>
                        <RefreshCw size={15} />
                    </Button>
                    <Button color="primary" size="sm" startContent={<Plus size={15} />} onPress={() => setIsCreateOpen(true)}>
                        Nova Nota
                    </Button>
                </div>
            </div>

            {isPrivate && (
                <MembersSection
                    topicId={id!}
                    members={members}
                    isOwner={isOwner}
                    ownerId={topic.owner_id}
                    onInviteClick={() => setIsInviteOpen(true)}
                    onMemberRemoved={(memberId) => setMembers((prev) => prev.filter((m) => m.id !== memberId))}
                />
            )}

            {/* Filters */}
            <div className="flex gap-3 px-6 py-4 justify-center">
                <Input
                    placeholder="Filtrar por nome..."
                    value={search}
                    onValueChange={setSearch}
                    startContent={<Search size={16} className="text-default-400" />}
                    className="flex-1 max-w-2xl"
                />
                <Select
                    selectedKeys={[sort]}
                    onSelectionChange={(keys) => setSort([...keys][0] as typeof sort)}
                    className="w-48"
                >
                    <SelectItem key="recent">Mais recentes</SelectItem>
                    <SelectItem key="oldest">Mais antigos</SelectItem>
                    <SelectItem key="top">Mais votados</SelectItem>
                </Select>
            </div>

            {/* Notes grid */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
                {filtered.length === 0 ? (
                    <div className="flex items-center justify-center h-48">
                        <p className="text-default-400">Nenhuma nota encontrada</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((note) => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                onUpdated={(updated) => setNotes((prev) => prev.map((n) => n.id === updated.id ? updated : n))}
                                onEdit={setEditNote}
                                onDelete={setDeleteNote}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            <CreateNoteModal
                isOpen={isCreateOpen}
                topicId={id!}
                onClose={() => setIsCreateOpen(false)}
                onCreated={(note) => setNotes((prev) => [note, ...prev])}
            />
            <EditNoteModal
                note={editNote}
                onClose={() => setEditNote(null)}
                onUpdated={(updated) => setNotes((prev) => prev.map((n) => n.id === updated.id ? updated : n))}
            />
            <DeleteNoteModal
                note={deleteNote}
                onClose={() => setDeleteNote(null)}
                onDeleted={(noteId) => setNotes((prev) => prev.filter((n) => n.id !== noteId))}
            />

            <InviteMemberModal
                isOpen={isInviteOpen}
                topicId={id!}
                onClose={() => setIsInviteOpen(false)}
                onInvited={load}
            />
        </div>
    );
}