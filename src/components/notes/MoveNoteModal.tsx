import { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';
import { Select, SelectItem } from '@heroui/select';
import { Spinner } from '@heroui/spinner';
import { addToast } from '@heroui/toast';
import { ArrowRightLeft } from 'lucide-react';
import { topicService } from '@/services/topicServices';
import { noteService } from '@/services/noteServices';
import type { Note, Topic } from '@/types/topicTypes';

interface Props {
    note: Note | null;
    currentTopicId: string;
    onClose: () => void;
    onMoved: (noteId: string) => void;
}

export function MoveNoteModal({ note, currentTopicId, onClose, onMoved }: Props) {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedTopicId, setSelectedTopicId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isMoving, setIsMoving] = useState(false);

    useEffect(() => {
        if (!note) return;
        loadTopics();
    }, [note]);

    async function loadTopics() {
        try {
            setIsLoading(true);
            const result = await topicService.getAll(1, 100);
            // exclui o tópico atual
            setTopics(result.data.filter((t) => t.id !== currentTopicId));
        } catch {
            addToast({ title: 'Erro ao carregar tópicos', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        } finally {
            setIsLoading(false);
        }
    }

    async function handleMove() {
        if (!note || !selectedTopicId) return;
        try {
            setIsMoving(true);
            await noteService.moveNote(note.id, selectedTopicId);
            addToast({ title: 'Nota movida!', color: 'success', timeout: 3000, shouldShowTimeoutProgress: true });
            onMoved(note.id);
            onClose();
        } catch {
            addToast({ title: 'Erro ao mover nota', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        } finally {
            setIsMoving(false);
        }
    }

    return (
        <Modal isOpen={!!note} onClose={onClose} size="sm">
            <ModalContent>
                <ModalHeader className="flex items-center gap-2">
                    <ArrowRightLeft size={18} />
                    Mover nota
                </ModalHeader>
                <ModalBody>
                    <p className="text-sm text-default-400 mb-2">
                        Seleciona o tópico de destino para <span className="font-semibold text-foreground">"{note?.title}"</span>.
                    </p>
                    {isLoading ? (
                        <div className="flex justify-center py-4"><Spinner size="sm" /></div>
                    ) : topics.length === 0 ? (
                        <p className="text-sm text-default-400 text-center py-4">Sem outros tópicos disponíveis.</p>
                    ) : (
                        <Select
                            label="Tópico destino"
                            placeholder="Seleciona um tópico..."
                            selectedKeys={selectedTopicId ? [selectedTopicId] : []}
                            onSelectionChange={(keys) => setSelectedTopicId([...keys][0] as string)}
                        >
                            {topics.map((topic) => (
                                <SelectItem key={topic.id}>
                                    {topic.title}
                                </SelectItem>
                            ))}
                        </Select>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button variant="flat" onPress={onClose}>Cancelar</Button>
                    <Button
                        color="primary"
                        onPress={handleMove}
                        isLoading={isMoving}
                        isDisabled={!selectedTopicId || isLoading}
                        startContent={<ArrowRightLeft size={14} />}
                    >
                        Mover
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}