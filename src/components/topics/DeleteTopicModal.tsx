// src/components/topics/DeleteTopicModal.tsx
import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';
import { addToast } from '@heroui/toast';
import { Trash2 } from 'lucide-react';
import { topicService } from '@/services/topicServices';
import type { Topic } from '@/types/topicTypes';

interface DeleteTopicModalProps {
    topic: Topic | null;
    isOpen: boolean;
    onClose: () => void;
    onDeleted: (id: string) => void;
}

export function DeleteTopicModal({ topic, isOpen, onClose, onDeleted }: DeleteTopicModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleDelete() {
        try {
            setIsLoading(true);
            await topicService.delete(topic!.id);

            addToast({
                title: 'Tópico deletado!',
                color: 'success',
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });

            onDeleted(topic!.id);
            onClose();
        } catch {
            addToast({
                title: 'Erro ao deletar tópico',
                description: 'Tente novamente.',
                color: 'danger',
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <p className="text-lg font-bold">Deletar Tópico</p>
                </ModalHeader>

                <ModalBody className="flex flex-col items-center gap-4 py-4">
                    <div className="p-4 rounded-full bg-danger-100">
                        <Trash2 size={28} className="text-danger" />
                    </div>
                    <div className="text-center">
                        <p className="font-medium">Tem certeza que deseja deletar?</p>
                        <p className="text-sm text-default-400 mt-1">
                            <span className="font-semibold text-foreground">"{topic?.title}"</span> será deletado permanentemente.
                        </p>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button variant="flat" onPress={onClose} isDisabled={isLoading} fullWidth>
                        Cancelar
                    </Button>
                    <Button color="danger" onPress={handleDelete} isLoading={isLoading} fullWidth>
                        Deletar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}