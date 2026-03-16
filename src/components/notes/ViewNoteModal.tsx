// src/components/notes/ViewNoteModal.tsx
import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button, ButtonGroup } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Tabs, Tab } from '@heroui/tabs';
import { Tooltip } from '@heroui/tooltip';
import { Divider } from '@heroui/divider';
import { addToast } from '@heroui/toast';
import ReactMarkdown from 'react-markdown';
import {
    Copy, Pencil, Trash2, ThumbsUp, ThumbsDown,
    Clock, RefreshCw,
} from 'lucide-react';
import type { Note } from '@/types/topicTypes';
import remarkGfm from "remark-gfm";

interface Props {
    note: Note | null;
    onClose: () => void;
    onEdit: (note: Note) => void;
    onDelete: (note: Note) => void;
}

const FONT_SIZES = [
    { label: 'A', size: 'text-sm', prose: 'prose-sm' },
    { label: 'A', size: 'text-base', prose: 'prose-base' },
    { label: 'A', size: 'text-lg', prose: 'prose-lg' },
];
function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'hoje';
    if (days === 1) return 'há 1 dia';
    return `há ${days} dias`;
}

export function ViewNoteModal({ note, onClose, onEdit, onDelete }: Props) {
    const [fontIndex, setFontIndex] = useState(1);
    const [tab, setTab] = useState<'preview' | 'raw'>('preview');

    if (!note) return null;

    const font = FONT_SIZES[fontIndex];
    const upvotes = note.up_votes?.length ?? 0;
    const downvotes = note.down_votes?.length ?? 0;

    function handleCopy() {
        if (!note) return;
        navigator.clipboard.writeText(note.description ?? note.title ?? '');
        addToast({ title: 'Copiado!', color: 'success', timeout: 2000, shouldShowTimeoutProgress: true });
    }

    function handleEdit() {
        if (!note) return;
        onClose();
        onEdit(note);
    }

    function handleDelete() {
        if (!note) return;
        onClose();
        onDelete(note);
    }
    return (
        <Modal
            isOpen={!!note}
            onClose={onClose}
            size="3xl"
            scrollBehavior="inside"
        >
            <ModalContent>
                {/* Header */}
                <ModalHeader className="flex flex-col gap-3 pb-0">
                    <div className="flex items-start justify-between gap-4">
                        <h2 className="text-xl font-black leading-tight flex-1">{note.title}</h2>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                            {/* Font size */}
                            <div className="flex items-center gap-0.5 border border-divider rounded-lg p-0.5">
                                <ButtonGroup size="sm" variant="flat">
                                    {FONT_SIZES.map((_, i) => (
                                        <Button
                                            key={i}
                                            onPress={() => setFontIndex(i)}
                                            color={fontIndex === i ? 'primary' : 'default'}
                                            variant={fontIndex === i ? 'flat' : 'light'}
                                            className={`min-w-0 px-3 font-bold ${i === 0 ? 'text-xs' : i === 1 ? 'text-sm' : 'text-base'}`}
                                        >
                                            A
                                        </Button>
                                    ))}
                                </ButtonGroup>
                            </div>
                            <div className='mr-4 space-x-1'>
                                <Tooltip content="Copiar conteúdo">
                                    <Button isIconOnly size="sm" variant="flat" onPress={handleCopy}>
                                        <Copy size={14} />
                                    </Button>
                                </Tooltip>

                                <Tooltip content="Editar nota">
                                    <Button isIconOnly size="sm" variant="flat" onPress={handleEdit}>
                                        <Pencil size={14} />
                                    </Button>
                                </Tooltip>

                                <Tooltip content="Deletar nota" color="danger">
                                    <Button isIconOnly size="sm" variant="flat" color="danger" onPress={handleDelete}>
                                        <Trash2 size={14} />
                                    </Button>
                                </Tooltip>
                            </div>
                        </div>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-3 flex-wrap pb-2">
                        <div className="flex items-center gap-1 text-xs text-default-400">
                            <Clock size={12} />
                            <span>Criada {timeAgo(note.created_at)}</span>
                        </div>
                        {note.updated_at !== note.created_at && (
                            <div className="flex items-center gap-1 text-xs text-default-400">

                                {note.updated_at ? <>   <RefreshCw size={12} />
                                    <span>Atualizada {timeAgo(note.updated_at)}</span></> : <></>}


                            </div>
                        )}
                        <div className="flex items-center gap-2 ml-auto">
                            <Chip
                                size="sm"
                                variant="flat"
                                color="success"
                                startContent={<ThumbsUp size={11} />}
                            >
                                {upvotes}
                            </Chip>
                            <Chip
                                size="sm"
                                variant="flat"
                                color="danger"
                                startContent={<ThumbsDown size={11} />}
                            >
                                {downvotes}
                            </Chip>
                        </div>
                    </div>

                    <Divider />

                    {/* Tabs */}
                    {note.description && (
                        <Tabs
                            selectedKey={tab}
                            onSelectionChange={(k) => setTab(k as 'preview' | 'raw')}
                            size="sm"
                            variant="underlined"
                            classNames={{ base: 'mt-1' }}
                        >
                            <Tab key="preview" title="Leitura" />
                            <Tab key="raw" title="Raw" />
                        </Tabs>
                    )}
                </ModalHeader>

                {/* Body */}
                <ModalBody className="py-4">
                    {!note.description ? (
                        <p className="text-default-400 text-sm italic">Sem descrição.</p>
                    ) : tab === 'preview' ? (
                        <div className={`
                            prose dark:prose-invert max-w-none
                            ${font.prose} ${font.size}
                            [&>h1]:font-black [&>h2]:font-bold [&>h3]:font-semibold
                            [&>ul]:list-disc [&>ol]:list-decimal
                            [&>blockquote]:border-l-4 [&>blockquote]:border-primary/40 [&>blockquote]:pl-4 [&>blockquote]:text-default-400
                            [&>code]:bg-default-100 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-primary
                            [&>pre]:bg-default-100 [&>pre]:rounded-xl [&>pre]:p-4
                            [&>hr]:border-divider
                        `}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.description}</ReactMarkdown>
                        </div>
                    ) : (
                        <pre className={`
                            whitespace-pre-wrap wrap-break-word font-mono bg-default-100
                            rounded-xl p-4 ${font.size} text-default-600
                        `}>
                            {note.description}
                        </pre>
                    )}
                </ModalBody>

                <ModalFooter className="pt-0">
                    <Button variant="flat" onPress={onClose} fullWidth>
                        Fechar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}