// src/components/notes/NoteCard.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Clock, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import {
    Dropdown, DropdownTrigger, DropdownMenu,
    DropdownSection, DropdownItem,
} from '@heroui/dropdown';
import { addToast } from '@heroui/toast';
import { topicService } from '@/services/topicServices';
import { useAuth } from '@/contexts/AuthContext';
import type { Note } from '@/types/topicTypes';
import ReactMarkdown from 'react-markdown';

interface NoteCardProps {
    note: Note;
    onUpdated: (note: Note) => void;
    onEdit: (note: Note) => void;
    onDelete: (note: Note) => void;
}

function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'hoje';
    if (days === 1) return 'há 1 dia';
    return `há ${days} dias`;
}

export function NoteCard({ note, onUpdated, onEdit, onDelete }: NoteCardProps) {
    const { user } = useAuth();
    const [isVoting, setIsVoting] = useState(false);

    const hasUpvoted = (note.up_votes ?? []).some((v) => v.user_id === user?.user_id);
    const hasDownvoted = (note.down_votes ?? []).some((v) => v.user_id === user?.user_id);

    async function handleUpvote() {
        if (isVoting) return;
        try {
            setIsVoting(true);
            const updated = hasUpvoted
                ? await topicService.removeUpvote(note.id)
                : await topicService.upvote(note.id);
            onUpdated(updated);
        } catch {
            addToast({ title: 'Erro ao votar', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        } finally {
            setIsVoting(false);
        }
    }

    async function handleDownvote() {
        if (isVoting) return;
        try {
            setIsVoting(true);
            const updated = hasDownvoted
                ? await topicService.removeDownvote(note.id)
                : await topicService.downvote(note.id);
            onUpdated(updated);
        } catch {
            addToast({ title: 'Erro ao votar', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        } finally {
            setIsVoting(false);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative rounded-xl border border-divider bg-default-50 dark:bg-default-100/5 overflow-hidden group"
        >
            {/* Accent line bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/40" />

            <div className="flex flex-col gap-3 p-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-primary/10">
                            <Pencil size={13} className="text-primary" />
                        </div>
                        <p className="font-semibold text-sm line-clamp-1">{note.title}</p>
                    </div>

                    <Dropdown>
                        <DropdownTrigger>
                            <button className="text-default-400 hover:text-default-600 transition-colors shrink-0">
                                <MoreVertical size={15} />
                            </button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Ações da nota"
                            onAction={(key) => {
                                if (key === 'edit') onEdit(note);
                                if (key === 'delete') onDelete(note);
                            }}
                        >
                            <DropdownSection title="Ações">
                                <DropdownItem key="edit" startContent={<Pencil size={14} />} description="Editar título e conteúdo">
                                    Editar nota
                                </DropdownItem>
                            </DropdownSection>
                            <DropdownSection title="Zona de perigo">
                                <DropdownItem key="delete" className="text-danger" color="danger" startContent={<Trash2 size={14} />} description="Esta ação é irreversível">
                                    Deletar nota
                                </DropdownItem>
                            </DropdownSection>
                        </DropdownMenu>
                    </Dropdown>
                </div>

                {/* Descrição */}
                {note.description && (
                    <div className="text-xs text-default-400 leading-relaxed prose prose-invert prose-xs max-w-none line-clamp-4 [&>*]:my-0.5 [&>h1]:text-sm [&>h2]:text-xs [&>h3]:text-xs">
                        <ReactMarkdown>{note.description}</ReactMarkdown>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-1">
                    {/* Votes */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleUpvote}
                            disabled={isVoting}
                            className={`flex items-center gap-1.5 text-xs transition-colors ${hasUpvoted ? 'text-success' : 'text-default-400 hover:text-success'
                                }`}
                        >
                            <ThumbsUp size={13} />
                            <span>{'temp 0'}</span>
                        </button>

                        <button
                            onClick={handleDownvote}
                            disabled={isVoting}
                            className={`flex items-center gap-1.5 text-xs transition-colors ${hasDownvoted ? 'text-danger' : 'text-default-400 hover:text-danger'
                                }`}
                        >
                            <ThumbsDown size={13} />
                            <span>{'temp 0'}</span>
                        </button>
                    </div>

                    {/* Data */}
                    <div className="flex items-center gap-1 text-xs text-default-400">
                        <Clock size={11} />
                        <span>{timeAgo(note.created_at)}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}