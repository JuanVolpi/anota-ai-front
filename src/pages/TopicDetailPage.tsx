// src/pages/TopicDetailPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@heroui/button';
import { Spinner } from '@heroui/spinner';
import { Chip } from '@heroui/chip';
import { addToast } from '@heroui/toast';
import { ArrowLeft, Plus, RefreshCw, Lock, Globe } from 'lucide-react';
import { Accordion, AccordionItem, Tooltip } from '@heroui/react';
import { topicService } from '@/services/topicServices';
import { noteService } from '@/services/noteServices';
import { useAuth } from '@/contexts/AuthContext';
import { useNotes } from '@/hooks/useNotes';
import { NoteFilters } from '@/components/notes/NoteFilters';
import { NotesGrid } from '@/components/notes/NotesGrid';
import { CreateNoteModal } from '@/components/notes/CreateNoteModal';
import { EditNoteModal } from '@/components/notes/EditNoteModal';
import { DeleteNoteModal } from '@/components/notes/DeleteNoteModal';
import { ViewNoteModal } from '@/components/notes/ViewNoteModal';
import { TopicPanel } from '@/components/topics/TopicPanel';
import { InviteMemberModal } from '@/components/topics/InviteMemberModal';
import { ChangeVisibilityModal } from '@/components/topics/ChangeVisibilityModal';
import type { TopicDetail, Note, TopicMember } from '@/types/topicTypes';
import { TopicDetailSkeleton } from '@/components/notes/TopicDetailSkeleton';

export function TopicDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [topic, setTopic] = useState<TopicDetail | null>(null);
    const [members, setMembers] = useState<TopicMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sort, setSort] = useState<'recent' | 'oldest' | 'top'>('recent');
    const [panelRefreshKey, setPanelRefreshKey] = useState(0);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editNote, setEditNote] = useState<Note | null>(null);
    const [deleteNote, setDeleteNote] = useState<Note | null>(null);
    const [viewNote, setViewNote] = useState<Note | null>(null);
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);

    const {
        notes, isLoading: isLoadingNotes, page, totalPages, total,
        search, setSearch, setPage,
        reload: reloadNotes,
        updateNote, addNote, removeNote,
    } = useNotes(id!);

    function triggerPanelRefresh() { setPanelRefreshKey((k) => k + 1); }

    useEffect(() => { if (id) loadTopic(); }, [id]);

    async function loadTopic() {
        try {
            setIsLoading(true);
            const data = await topicService.getById(id!);
            setTopic(data);
            setMembers(Array.isArray(data.members) ? data.members : []);
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
            updateNote(updated);
            triggerPanelRefresh();
        } catch {
            addToast({ title: 'Erro ao fixar nota', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        }
    }

    const sortedNotes = [...notes].sort((a, b) => {
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
        return <TopicDetailSkeleton />;
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
                        <Chip size="sm" variant="flat" color={isOwner ? 'primary' : canWrite ? 'success' : 'warning'}>
                            {isOwner ? 'Dono' : canWrite ? 'Membro' : 'Leitura'}
                        </Chip>
                    </div>
                    {topic.description && (
                        <p className="text-sm text-default-400 mt-0.5 truncate">{topic.description}</p>
                    )}
                    <p className="text-xs text-default-300 mt-0.5">
                        {total} nota{total !== 1 ? 's' : ''}
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
                        <Button isIconOnly variant="flat" size="sm" onPress={() => { loadTopic(); reloadNotes(); }}>
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
                <Accordion isCompact defaultExpandedKeys={[]} itemClasses={{ base: 'px-4 md:px-6', title: 'text-sm font-medium text-default-500', trigger: 'py-3', content: 'pb-4' }}>
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
                            ownerUsername={isOwner ? user!.username : members.find((m) => m.id === topic.owner_id)?.username ?? 'Dono'}
                            isOwner={isOwner}
                            members={members}
                            onMembersChanged={(m) => { setMembers(m); triggerPanelRefresh(); }}
                            refreshKey={panelRefreshKey}
                        />
                    </AccordionItem>
                </Accordion>
            </div>

            {/* Filters */}
            <NoteFilters
                search={search}
                onSearchChange={setSearch}
                sort={sort}
                onSortChange={setSort}
            />

            {/* Notes */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-6 pt-2 min-h-0">
                <NotesGrid
                    notes={sortedNotes}
                    isLoading={isLoadingNotes}
                    page={page}
                    totalPages={totalPages}
                    search={search}
                    canWrite={canWrite}
                    onPageChange={setPage}
                    onUpdated={(n) => { updateNote(n); triggerPanelRefresh(); }}
                    onEdit={setEditNote}
                    onDelete={setDeleteNote}
                    onView={setViewNote}
                    onTogglePin={handleTogglePin}
                />
            </div>

            {/* Modals */}
            <CreateNoteModal
                isOpen={isCreateOpen}
                topicId={id!}
                onClose={() => setIsCreateOpen(false)}
                onCreated={(note) => { addNote(note); triggerPanelRefresh(); }}
            />
            <EditNoteModal
                note={editNote}
                onClose={() => setEditNote(null)}
                onUpdated={(n) => { updateNote(n); triggerPanelRefresh(); }}
            />
            <DeleteNoteModal
                note={deleteNote}
                onClose={() => setDeleteNote(null)}
                onDeleted={(noteId) => { removeNote(noteId); triggerPanelRefresh(); }}
            />
            <InviteMemberModal
                isOpen={isInviteOpen}
                topicId={id!}
                onClose={() => setIsInviteOpen(false)}
                onInvited={loadTopic}
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
                onUpdated={(updated) => { setTopic((prev) => prev ? { ...prev, ...updated } : null); setIsVisibilityOpen(false); }}
            />
        </div>
    );
}