import { Pagination } from '@heroui/pagination';
import { FileText } from 'lucide-react';
import { NoteCard } from './NoteCard';
import type { Note } from '@/types/topicTypes';
import { NoteCardSkeleton } from './NoteCardSkeleton';

interface Props {
    notes: Note[];
    isLoading: boolean;
    page: number;
    totalPages: number;
    search: string;
    canWrite: boolean;
    onPageChange: (p: number) => void;
    onUpdated: (note: Note) => void;
    onEdit: (note: Note) => void;
    onDelete: (note: Note) => void;
    onView: (note: Note) => void;
    onTogglePin: (note: Note) => void;
}

export function NotesGrid({
    notes, isLoading, page, totalPages, search,
    canWrite, onPageChange,
    onUpdated, onEdit, onDelete, onView, onTogglePin,
}: Props) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <NoteCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (notes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 h-48 text-center">
                <div className="p-4 rounded-full bg-default-100">
                    <FileText size={24} className="text-default-400" />
                </div>
                <div>
                    <p className="font-semibold text-default-600">Nenhuma nota encontrada</p>
                    <p className="text-sm text-warning">
                        {search
                            ? `Nenhuma nota corresponde ao filtro "${search}"`
                            : 'Este tópico ainda não tem notas'
                        }
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {notes.map((note) => (
                    <NoteCard
                        key={note.id}
                        note={note}
                        canWrite={canWrite}
                        onUpdated={onUpdated}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onView={onView}
                        onTogglePin={onTogglePin}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center pt-2">
                    <Pagination
                        total={totalPages}
                        page={page}
                        onChange={onPageChange}
                        showControls
                        color="primary"
                        variant="flat"
                        size="sm"
                    />
                </div>
            )}
        </div>
    );
}