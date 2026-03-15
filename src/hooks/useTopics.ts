import { useState, useEffect } from 'react';
import { addToast } from '@heroui/toast';
import { topicService } from '@/services/topicServices';
import type { Topic } from '@/types/topicTypes';

const LIMIT = 20;

export function useTopics() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [showArchived, setShowArchived] = useState(false);

    useEffect(() => {
        load(page);
    }, [page, showArchived]);

    async function load(p: number) {
        try {
            setIsLoading(true);
            const result = await topicService.getAll(p, LIMIT, showArchived);
            setTopics(Array.isArray(result.data) ? result.data : []);
            setTotalPages(result.total_pages ?? 1);
            setTotal(result.total ?? 0);
        } catch {
            addToast({ title: 'Erro ao carregar tópicos', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        } finally {
            setIsLoading(false);
        }
    }

    async function archive(topic: Topic) {
        try {
            await topicService.archive(topic.id);
            addToast({ title: 'Tópico arquivado!', color: 'success', timeout: 3000, shouldShowTimeoutProgress: true });
            load(page);
        } catch {
            addToast({ title: 'Erro ao arquivar tópico', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        }
    }

    async function restore(topic: Topic) {
        try {
            await topicService.restore(topic.id);
            addToast({ title: 'Tópico restaurado!', color: 'success', timeout: 3000, shouldShowTimeoutProgress: true });
            load(page);
        } catch {
            addToast({ title: 'Erro ao restaurar tópico', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        }
    }

    function updateTopic(updated: Topic) {
        setTopics((prev) => prev.map((t) => t.id === updated.id ? updated : t));
    }

    function removeTopic(id: string) {
        setTopics((prev) => prev.filter((t) => t.id !== id));
    }

    return {
        topics, isLoading, page, totalPages, total,
        showArchived, setShowArchived, setPage,
        reload: load, archive, restore, updateTopic, removeTopic,
    };
}