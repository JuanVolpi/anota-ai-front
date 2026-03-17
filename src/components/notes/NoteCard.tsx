// src/components/notes/NoteCard.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Clock, MoreVertical, Pencil, Trash2, SmilePlus, Pin, PinOff, ArrowRightLeft } from 'lucide-react';
import {
    Dropdown, DropdownTrigger, DropdownMenu,
    DropdownSection, DropdownItem,
} from '@heroui/dropdown';
import { Popover, PopoverTrigger, PopoverContent } from '@heroui/popover';
import { Card, CardBody, CardFooter } from '@heroui/card';
import { Divider } from '@heroui/divider';
import { Button } from '@heroui/button';
import { Spinner } from '@heroui/spinner';
import { addToast } from '@heroui/toast';
import { noteService } from '@/services/noteServices';
import { useAuth } from '@/contexts/AuthContext';
import { Lock } from 'lucide-react';
import type { Note } from '@/types/topicTypes';
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";

const ALLOWED_EMOJIS = ['👍', '❤️', '🔥', '💡', '😂', '😮'];

interface NoteCardProps {
    note: Note;
    canWrite?: boolean;
    onUpdated: (note: Note) => void;
    onEdit: (note: Note) => void;
    onDelete: (note: Note) => void;
    onView: (note: Note) => void;
    onTogglePin: (note: Note) => void;
    onMove: (note: Note) => void;
}

function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'hoje';
    if (days === 1) return 'há 1 dia';
    return `há ${days} dias`;
}

function timeRemaining(date: string) {
    const diff = new Date(date).getTime() - Date.now();

    if (diff <= 0) return 'expirada';

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `expira em ${minutes}m`;
    if (hours < 24) return `expira em ${hours}h`;
    return `expira em ${days}d`;
}

function stripMarkdown(text: string): string {
    return text
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/#{1,6}\s/g, '')
        .replace(/(\*\*|__)(.*?)\1/g, '$2')
        .replace(/(\*|_)(.*?)\1/g, '$2')
        .replace(/`{1,3}[^`]*`{1,3}/g, '')
        .replace(/>\s.*/g, '')
        .replace(/[-*+]\s/g, '')
        .replace(/\n+/g, ' ')
        .trim();
}

export function NoteCard({ note, onUpdated, onEdit, onDelete, onView, onTogglePin, canWrite = true, onMove }: NoteCardProps) {
    const { user } = useAuth();
    const [isUpVoting, setIsUpVoting] = useState(false);
    const [isDownVoting, setIsDownVoting] = useState(false);
    const [isReacting, setIsReacting] = useState(false);
    const [isReactionOpen, setIsReactionOpen] = useState(false);

    const hasUpvoted = (note.up_votes ?? []).some((v) => v.user_id === user?.user_id);
    const hasDownvoted = (note.down_votes ?? []).some((v) => v.user_id === user?.user_id);
    const upvotes = note.up_votes?.length ?? 0;
    const downvotes = note.down_votes?.length ?? 0;
    const isTemporary = !!note.expires_at;
    const activeReactions = ALLOWED_EMOJIS.filter((e) => getReactionCount(e) > 0);

    function getReactionCount(emoji: string) {
        return note.reactions?.filter((r) => r.emoji === emoji).length ?? 0;
    }

    function hasReacted(emoji: string) {
        return note.reactions?.some((r) => r.emoji === emoji && r.user_id === user?.user_id) ?? false;
    }

    async function handleReaction(emoji: string, e: React.MouseEvent) {
        e.stopPropagation();
        if (isReacting) return;
        setIsReactionOpen(false);

        const reacted = hasReacted(emoji);

        // optimistic update imediato
        const optimisticNote: Note = {
            ...note,
            reactions: reacted
                ? (note.reactions ?? []).filter(
                    (r) => !(r.emoji === emoji && r.user_id === user!.user_id)
                )
                : [
                    ...(note.reactions ?? []),
                    { emoji, user_id: user!.user_id, created_at: new Date().toISOString() },
                ],
        };
        onUpdated(optimisticNote);

        try {
            setIsReacting(true);
            if (reacted) {
                await noteService.removeReaction(note.id, emoji);
            } else {
                await noteService.addReaction(note.id, emoji);
            }
        } catch {
            onUpdated(note); // reverte se falhar
            addToast({ title: 'Erro ao reagir', color: 'danger', timeout: 2000, shouldShowTimeoutProgress: true });
        } finally {
            setIsReacting(false);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative cursor-pointer group h-full"
            onClick={() => onView(note)}
        >
            <Card
                className="border h-52 border-divider bg-default-50 dark:bg-default-100/5 shadow-none relative overflow-hidden flex flex-col"
                shadow="none"
            >
                {/* Hover glow */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
                    style={{ background: 'linear-gradient(to top, #006FEE22, transparent)' }}
                />
                {/* Accent line — warning se pinned, senão primary */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-colors duration-300 z-10 ${note.pinned ? 'bg-warning' : 'bg-primary/50 group-hover:bg-primary'}`} />

                <CardBody className="flex flex-col gap-2 p-4 flex-1 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className="p-1.5 rounded-md bg-primary/10 shrink-0 group-hover:bg-primary/20 transition-colors">
                                <Pencil size={12} className="text-primary" />
                            </div>
                            <p className="font-bold text-sm truncate">{note.title}</p>
                            {note.pinned && (
                                <Pin size={11} className="text-warning shrink-0" />
                            )}
                            {isTemporary && (
                                <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/30">
                                    <Clock size={10} />
                                    temporária
                                </span>
                            )}
                        </div>

                        <Dropdown>
                            <DropdownTrigger>
                                <button
                                    className="text-default-300 hover:text-default-600 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MoreVertical size={15} />
                                </button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Ações da nota"
                                onAction={(key) => {
                                    if (key === 'edit') onEdit(note);
                                    if (key === 'pin') onTogglePin(note);
                                    if (key === 'move') onMove(note);
                                    if (key === 'delete') onDelete(note);
                                }}
                            >
                                {canWrite ? (
                                    <DropdownSection title="Ações">
                                        <DropdownItem
                                            key="pin"
                                            startContent={note.pinned ? <PinOff size={14} /> : <Pin size={14} />}
                                            description={note.pinned ? 'Remover dos fixados' : 'Mostrar sempre primeiro'}
                                        >
                                            {note.pinned ? 'Desafixar nota' : 'Fixar nota'}
                                        </DropdownItem>
                                        <DropdownItem
                                            key="edit"
                                            startContent={<Pencil size={14} />}
                                            description="Editar título e conteúdo"
                                        >
                                            Editar nota
                                        </DropdownItem>
                                        <DropdownItem
                                            key="move"
                                            startContent={<ArrowRightLeft size={14} />}
                                            description="Enviar para outro tópico"
                                        ></DropdownItem>
                                    </DropdownSection>
                                ) : (
                                    <DropdownSection title="Informação">
                                        <DropdownItem key="readonly" isReadOnly className="text-default-400" startContent={<Lock size={14} />}>
                                            Apenas leitura
                                        </DropdownItem>
                                    </DropdownSection>
                                )}
                                {canWrite ? (
                                    <DropdownSection title="Zona de perigo">
                                        <DropdownItem
                                            key="delete"
                                            className="text-danger"
                                            color="danger"
                                            startContent={<Trash2 size={14} />}
                                            description="Esta ação é irreversível"
                                        >
                                            Deletar nota
                                        </DropdownItem>
                                    </DropdownSection>
                                ) : null}
                            </DropdownMenu>
                        </Dropdown>
                    </div>

                    {/* Descrição */}
                    {note.description && (
                        <p className="text-xs text-default-400 leading-relaxed line-clamp-3 wrap-break-words">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.description}</ReactMarkdown>
                        </p>
                    )}
                </CardBody>

                <Divider className="opacity-50" />

                <CardFooter
                    className="px-3 py-2 flex flex-col gap-1.5 relative z-10 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Linha 1: votos + timestamp */}
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1">
                            <Button
                                size="sm"
                                variant={hasUpvoted ? 'flat' : 'light'}
                                color={hasUpvoted ? 'success' : 'default'}
                                isDisabled={isUpVoting}
                                className="h-6 min-w-0 px-2 gap-1"
                                startContent={isUpVoting ? <Spinner size="sm" color="default" /> : <ThumbsUp size={11} />}
                                onPress={async () => {
                                    if (isUpVoting) return;
                                    try {
                                        setIsUpVoting(true);
                                        const updated = hasUpvoted
                                            ? await noteService.removeUpvote(note.id)
                                            : await noteService.upvote(note.id);
                                        onUpdated(updated);
                                    } catch {
                                        addToast({ title: 'Erro ao votar', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
                                    } finally {
                                        setIsUpVoting(false);
                                    }
                                }}
                            >
                                <span className="text-xs">{isUpVoting ? '' : upvotes}</span>
                            </Button>

                            <Button
                                size="sm"
                                variant={hasDownvoted ? 'flat' : 'light'}
                                color={hasDownvoted ? 'danger' : 'default'}
                                isDisabled={isDownVoting}
                                className="h-6 min-w-0 px-2 gap-1"
                                startContent={isDownVoting ? <Spinner size="sm" color="default" /> : <ThumbsDown size={11} />}
                                onPress={async () => {
                                    if (isDownVoting) return;
                                    try {
                                        setIsDownVoting(true);
                                        const updated = hasDownvoted
                                            ? await noteService.removeDownvote(note.id)
                                            : await noteService.downvote(note.id);
                                        onUpdated(updated);
                                    } catch {
                                        addToast({ title: 'Erro ao votar', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
                                    } finally {
                                        setIsDownVoting(false);
                                    }
                                }}
                            >
                                <span className="text-xs">{isDownVoting ? '' : downvotes}</span>
                            </Button>
                        </div>

                        <div className="flex flex-col items-end text-xs">
                            <span>{timeAgo(note.created_at)}</span>

                            {note.expires_at && (
                                <span className="text-warning text-[10px]">
                                    {timeRemaining(note.expires_at)}
                                </span>
                            )}
                        </div>
                    </div>

                    <Divider />

                    {/* Linha 2: reactions */}
                    <div className="flex items-center gap-1 p-1 flex-wrap w-full">
                        <Popover placement="top"
                            isOpen={isReactionOpen}
                            onOpenChange={setIsReactionOpen}>
                            <PopoverTrigger>
                                <button
                                    className="flex items-center justify-center w-6 h-6 rounded-full border border-divider text-default-400 hover:text-foreground hover:border-default-400 hover:bg-default-100 transition-all"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <SmilePlus size={12} />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="p-2" onClick={(e) => e.stopPropagation()}>
                                <div className="flex gap-1">
                                    {ALLOWED_EMOJIS.map((emoji) => (
                                        <button
                                            key={emoji}
                                            onClick={(e) => handleReaction(emoji, e)}
                                            disabled={isReacting}
                                            className={`
                                                text-lg w-9 h-9 rounded-lg flex items-center justify-center transition-all
                                                ${hasReacted(emoji) ? 'bg-primary/10 ring-1 ring-primary' : 'hover:bg-default-100'}
                                            `}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>

                        {activeReactions.map((emoji) => (
                            <button
                                key={emoji}
                                onClick={(e) => handleReaction(emoji, e)}
                                disabled={isReacting}
                                className={`
                                    flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs border transition-all h-6
                                    ${hasReacted(emoji)
                                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                                        : 'border-divider bg-default-100 hover:border-primary/40 hover:bg-primary/5'
                                    }
                                `}
                            >
                                <span>{emoji}</span>
                                <span>{getReactionCount(emoji)}</span>
                            </button>
                        ))}
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
}