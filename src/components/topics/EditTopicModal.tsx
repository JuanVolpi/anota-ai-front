// src/components/topics/EditTopicModal.tsx
import { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input, Textarea } from '@heroui/input';
import { addToast } from '@heroui/toast';
import { topicService } from '@/services/topicServices';
import type { Topic } from '@/types/topicTypes';

interface EditTopicModalProps {
    topic: Topic | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdated: (topic: Topic) => void;
}

export function EditTopicModal({ topic, isOpen, onClose, onUpdated }: EditTopicModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (topic) {
            setTitle(topic.title);
            setDescription(topic.description ?? '');
        }
    }, [topic]);

    function handleClose() {
        onClose();
    }

    async function handleUpdate() {
        if (!title.trim()) {
            addToast({
                title: 'Campo obrigatório',
                description: 'O título é obrigatório.',
                color: 'warning',
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });
            return;
        }

        try {
            setIsLoading(true);
            const updated = await topicService.update(topic!.id, {
                title,
                description: description || undefined,
                visibility: topic!.visibility,
            });

            addToast({
                title: 'Tópico atualizado!',
                color: 'success',
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });

            onUpdated(updated);
            handleClose();
        } catch {
            addToast({
                title: 'Erro ao atualizar tópico',
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
        <Modal isOpen={isOpen} onClose={handleClose} size="md">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <p className="text-lg font-bold">Editar Tópico</p>
                    <p className="text-sm font-normal text-default-400">Atualize as informações do tópico.</p>
                </ModalHeader>

                <ModalBody className="flex flex-col gap-4">
                    <Input
                        label="Título"
                        value={title}
                        onValueChange={setTitle}
                        isRequired
                    />
                    <Input
                        label="Descrição"
                        value={description}
                        onValueChange={setDescription}
                    />
                </ModalBody>

                <ModalFooter>
                    <Button variant="flat" onPress={handleClose} isDisabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button color="primary" onPress={handleUpdate} isLoading={isLoading}>
                        Salvar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}