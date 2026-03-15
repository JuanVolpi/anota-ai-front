import { useState, useEffect } from 'react';
import { addToast } from '@heroui/toast';
import { noteService } from '@/services/noteServices';
import type { Note } from '@/types/topicTypes';

const LIMIT = 20;

export function useNotes(topicId: string, initialNotes: Note[] = []) {
    const [notes, setNotes] = useState<Note[]>(initialNotes);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(initialNotes.length);
    const [search, setSearch] = useState('');

    // carrega quando page muda
    useEffect(() => {
        load(page, search);
    }, [page]);

    // debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            load(1, search);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    async function load(p: number, q?: string) {
        try {
            setIsLoading(true);
            const result = await noteService.getNotes(topicId, p, LIMIT, q);
            setNotes(Array.isArray(result.data) ? result.data : []);
            setTotalPages(result.total_pages ?? 1);
            setTotal(result.total ?? 0);
        } catch {
            addToast({ title: 'Erro ao carregar notas', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        } finally {
            setIsLoading(false);
        }
    }

    function updateNote(updated: Note) {
        setNotes((prev) => prev.map((n) => n.id === updated.id ? updated : n));
    }

    function addNote(note: Note) {
        setNotes((prev) => [note, ...prev]);
        setTotal((t) => t + 1);
    }

    function removeNote(id: string) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
        setTotal((t) => Math.max(0, t - 1));
    }

    return {
        notes, isLoading, page, totalPages, total,
        search, setSearch, setPage,
        reload: () => load(page, search),
        updateNote, addNote, removeNote,
    };
}