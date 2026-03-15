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
import { InviteMemberModal } from '@/components/topics/InviteMemberModal';
import { ViewNoteModal } from '@/components/notes/ViewNoteModal';
import { ChangeVisibilityModal } from '@/components/topics/ChangeVisibilityModal';
import { TopicPanel } from '@/components/topics/TopicPanel';
import { Accordion, AccordionItem, Tooltip } from '@heroui/react';
import { noteService } from '@/services/noteServices';

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

    const [viewNote, setViewNote] = useState<Note | null>(null);
    const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);

    const [panelRefreshKey, setPanelRefreshKey] = useState(0);
    function triggerPanelRefresh() { setPanelRefreshKey((k) => k + 1); }

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

    async function handleTogglePin(note: Note) {
        try {
            const updated = note.pinned
                ? await noteService.unpinNote(note.id)
                : await noteService.pinNote(note.id);
            setNotes((prev) => prev.map((n) => n.id === updated.id ? updated : n));
            triggerPanelRefresh();
        } catch {
            addToast({ title: 'Erro ao fixar nota', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        }
    }

    const filtered = notes
        .filter((n) => n.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (b.pinned !== a.pinned) return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
            if (sort === 'recent') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            if (sort === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            return ((b.up_votes?.length ?? 0) - (b.down_votes?.length ?? 0)) - ((a.up_votes?.length ?? 0) - (a.down_votes?.length ?? 0));
        });

    const isOwner = topic?.owner_id === user?.user_id;
    const isPrivate = topic?.visibility === 'private';
    const currentMember = members.find((m) => m.id === user?.user_id);
    const canWrite = isOwner || !isPrivate || currentMember?.role === 'write' || currentMember?.role === undefined;

    if (isLoading) {
        return (
            <div className="flex flex-1 items-center justify-center h-full">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!topic) return null;

    return (
        <div className="flex flex-col w-full min-h-0 flex-1">

            {/* Header */}
            <div className="flex items-center gap-3 px-4 md:px-6 py-4 border-b border-divider shrink-0">
                <Button isIconOnly variant="flat" size="sm" onPress={() => navigate('/topics')}>
                    <ArrowLeft size={16} />
                </Button>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        {isPrivate
                            ? <Lock size={16} className="text-warning shrink-0" />
                            : <Globe size={16} className="text-primary shrink-0" />
                        }
                        <h2 className="text-lg md:text-xl font-bold truncate">{topic.title}</h2>
                        <Chip
                            size="sm"
                            variant="flat"
                            color={isOwner ? 'primary' : canWrite ? 'success' : 'warning'}
                        >
                            {isOwner ? 'Dono' : canWrite ? 'Membro' : 'Leitura'}
                        </Chip>
                    </div>
                    {topic.description && (
                        <p className="text-sm text-default-400 mt-0.5 truncate">{topic.description}</p>
                    )}
                    <p className="text-xs text-default-300 mt-0.5">
                        {notes.length} nota{notes.length !== 1 ? 's' : ''}
                    </p>
                </div>

                <div className="flex gap-2 shrink-0">
                    {isOwner && (
                        <Tooltip content="Alterar visibilidade">
                            <Button isIconOnly variant="flat" size="sm" onPress={() => setIsVisibilityOpen(true)}>
                                {isPrivate ? <Lock size={15} className="text-warning" /> : <Globe size={15} />}
                            </Button>
                        </Tooltip>
                    )}
                    <Tooltip content="Recarregar">
                        <Button isIconOnly variant="flat" size="sm" onPress={load}>
                            <RefreshCw size={15} />
                        </Button>
                    </Tooltip>
                    {canWrite && (
                        <Button color="primary" size="sm" startContent={<Plus size={15} />} onPress={() => setIsCreateOpen(true)}>
                            <span className="hidden sm:inline">Nova Nota</span>
                            <span className="sm:hidden">Nova</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Panel */}
            <div className="shrink-0 border-b border-divider">
                <Accordion
                    isCompact
                    defaultExpandedKeys={[]}
                    itemClasses={{
                        base: 'px-4 md:px-6',
                        title: 'text-sm font-medium text-default-500',
                        trigger: 'py-3',
                        content: 'pb-4',
                    }}
                >
                    <AccordionItem
                        key="panel"
                        title={
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Detalhes do tópico</span>
                                <span className="text-xs text-default-400">Membros · Estatísticas · Atividades</span>
                            </div>
                        }
                    >
                        <TopicPanel
                            topicId={id!}
                            ownerId={topic.owner_id}
                            isOwner={isOwner}
                            members={members}
                            onMembersChanged={(m) => { setMembers(m); triggerPanelRefresh(); }}
                            refreshKey={panelRefreshKey}
                        />
                    </AccordionItem>
                </Accordion>
            </div>

            {/* Filters */}
            <div className="flex gap-3 px-4 md:px-6 py-3 shrink-0">
                <Input
                    placeholder="Filtrar por nome..."
                    value={search}
                    onValueChange={setSearch}
                    startContent={<Search size={16} className="text-default-400" />}
                    className="flex-1"
                    size="sm"
                />
                <Select
                    selectedKeys={[sort]}
                    onSelectionChange={(keys) => setSort([...keys][0] as typeof sort)}
                    className="w-36 md:w-48"
                    size="sm"
                >
                    <SelectItem key="recent">Mais recentes</SelectItem>
                    <SelectItem key="oldest">Mais antigos</SelectItem>
                    <SelectItem key="top">Mais votados</SelectItem>
                </Select>
            </div>

            {/* Notes grid */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-6 pt-2 min-h-0">
                {filtered.length === 0 ? (
                    <div className="flex items-center justify-center h-48">
                        <p className="text-default-400 text-sm">Nenhuma nota encontrada</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map((note) => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                canWrite={canWrite}
                                onUpdated={(updated) => {
                                    setNotes((prev) => prev.map((n) => n.id === updated.id ? updated : n));
                                    triggerPanelRefresh();
                                }}
                                onEdit={setEditNote}
                                onDelete={setDeleteNote}
                                onView={setViewNote}
                                onTogglePin={handleTogglePin}
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
                onCreated={(note) => {
                    setNotes((prev) => [note, ...prev]);
                    triggerPanelRefresh();
                }}
            />
            <EditNoteModal
                note={editNote}
                onClose={() => setEditNote(null)}
                onUpdated={(updated) => {
                    setNotes((prev) => prev.map((n) => n.id === updated.id ? updated : n));
                    triggerPanelRefresh();
                }}
            />
            <DeleteNoteModal
                note={deleteNote}
                onClose={() => setDeleteNote(null)}
                onDeleted={(noteId) => {
                    setNotes((prev) => prev.filter((n) => n.id !== noteId));
                    triggerPanelRefresh();
                }}
            />
            <InviteMemberModal
                isOpen={isInviteOpen}
                topicId={id!}
                onClose={() => setIsInviteOpen(false)}
                onInvited={load}
            />
            <ViewNoteModal
                note={viewNote}
                onClose={() => setViewNote(null)}
                onEdit={(note) => { setViewNote(null); setEditNote(note); }}
                onDelete={(note) => { setViewNote(null); setDeleteNote(note); }}
            />
            <ChangeVisibilityModal
                topic={isVisibilityOpen ? topic : null}
                onClose={() => setIsVisibilityOpen(false)}
                onUpdated={(updated) => {
                    setTopic((prev) => prev ? { ...prev, ...updated } : null);
                    setIsVisibilityOpen(false);
                }}
            />
        </div>
    );
}