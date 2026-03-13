// src/components/notes/NoteCard.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Clock, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import {
    Dropdown, DropdownTrigger, DropdownMenu,
    DropdownSection, DropdownItem,
} from '@heroui/dropdown';
import { Card, CardBody, CardFooter } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Divider } from '@heroui/divider';
import { Button } from '@heroui/button';
import { addToast } from '@heroui/toast';
import { noteService } from '@/services/noteServices';
import { useAuth } from '@/contexts/AuthContext';
import type { Note } from '@/types/topicTypes';
import ReactMarkdown from 'react-markdown';

interface NoteCardProps {
    note: Note;
    onUpdated: (note: Note) => void;
    onEdit: (note: Note) => void;
    onDelete: (note: Note) => void;
    onView: (note: Note) => void;
}

function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'hoje';
    if (days === 1) return 'há 1 dia';
    return `há ${days} dias`;
}

export function NoteCard({ note, onUpdated, onEdit, onDelete, onView }: NoteCardProps) {
    const { user } = useAuth();
    const [isVoting, setIsVoting] = useState(false);

    const hasUpvoted = (note.up_votes ?? []).some((v) => v.user_id === user?.user_id);
    const hasDownvoted = (note.down_votes ?? []).some((v) => v.user_id === user?.user_id);
    const upvotes = note.up_votes?.length ?? 0;
    const downvotes = note.down_votes?.length ?? 0;

    async function handleUpvote(e: React.MouseEvent) {
        e.stopPropagation();
        if (isVoting) return;
        try {
            setIsVoting(true);
            const updated = hasUpvoted
                ? await noteService.removeUpvote(note.id)
                : await noteService.upvote(note.id);
            onUpdated(updated);
        } catch {
            addToast({ title: 'Erro ao votar', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        } finally {
            setIsVoting(false);
        }
    }

    async function handleDownvote(e: React.MouseEvent) {
        e.stopPropagation();
        if (isVoting) return;
        try {
            setIsVoting(true);
            const updated = hasDownvoted
                ? await noteService.removeDownvote(note.id)
                : await noteService.downvote(note.id);
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
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative cursor-pointer group"
            onClick={() => onView(note)}
        >
            <Card
                className="border min-h-52 border-divider bg-default-50 dark:bg-default-100/5 shadow-none relative overflow-hidden"
                shadow="none"
            >
                {/* Hover glow - dentro do card */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, #006FEE22, transparent)' }}
                />
                {/* Accent line - dentro do card */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/50 group-hover:bg-primary transition-colors duration-300" />

                <CardBody className="flex flex-col gap-3 p-4">

                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="p-1.5 rounded-md bg-primary/10 shrink-0 group-hover:bg-primary/20 transition-colors">
                                <Pencil size={12} className="text-primary" />
                            </div>
                            <p className="font-bold text-sm line-clamp-1">{note.title}</p>
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
                                    if (key === 'edit') { onEdit(note); }
                                    if (key === 'delete') { onDelete(note); }
                                }}
                            >
                                <DropdownSection title="Ações">
                                    <DropdownItem
                                        key="edit"
                                        startContent={<Pencil size={14} />}
                                        description="Editar título e conteúdo"
                                    >
                                        Editar nota
                                    </DropdownItem>
                                </DropdownSection>
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
                            </DropdownMenu>
                        </Dropdown>
                    </div>

                    {/* Descrição markdown */}
                    {note.description && (
                        <div className="text-xs text-default-400 leading-relaxed prose dark:prose-invert prose-xs max-w-none line-clamp-4
                            [&>*]:my-0.5 [&>h1]:text-sm [&>h1]:font-bold [&>h2]:text-xs [&>h2]:font-bold [&>h3]:text-xs
                            [&>code]:bg-default-100 [&>code]:px-1 [&>code]:rounded [&>code]:text-primary [&>code]:text-xs
                            [&>strong]:text-default-600 [&>em]:text-default-500">
                            <ReactMarkdown>{note.description}</ReactMarkdown>
                        </div>
                    )}

                </CardBody>

                <Divider className="opacity-50" />

                <CardFooter className="px-4 py-2.5 flex items-center justify-between gap-2">
                    {/* Votes */}
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant={hasUpvoted ? 'flat' : 'light'}
                            color={hasUpvoted ? 'success' : 'default'}
                            onPress={(e) => handleUpvote(e as unknown as React.MouseEvent)}
                            isDisabled={isVoting}
                            className="h-7 min-w-0 px-2 gap-1"
                            startContent={<ThumbsUp size={12} />}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span className="text-xs">{upvotes}</span>
                        </Button>

                        <Button
                            size="sm"
                            variant={hasDownvoted ? 'flat' : 'light'}
                            color={hasDownvoted ? 'danger' : 'default'}
                            onPress={(e) => handleDownvote(e as unknown as React.MouseEvent)}
                            isDisabled={isVoting}
                            className="h-7 min-w-0 px-2 gap-1"
                            startContent={<ThumbsDown size={12} />}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span className="text-xs">{downvotes}</span>
                        </Button>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-2">
                        {(upvotes - downvotes) > 0 && (
                            <Chip size="sm" variant="flat" color="success" className="h-5 text-xs">
                                +{upvotes - downvotes}
                            </Chip>
                        )}
                        <div className="flex items-center gap-1 text-xs text-default-400">
                            <Clock size={11} />
                            <span>{timeAgo(note.created_at)}</span>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
}