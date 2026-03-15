// src/components/topics/EditTopicModal.tsx
import { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Chip } from '@heroui/chip';
import { addToast } from '@heroui/toast';
import { Tag, X } from 'lucide-react';
import { topicService } from '@/services/topicServices';
import type { Topic } from '@/types/topicTypes';

interface Props {
    topic: Topic | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdated: (topic: Topic) => void;
}

export function EditTopicModal({ topic, isOpen, onClose, onUpdated }: Props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryInput, setCategoryInput] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (topic) {
            setTitle(topic.title);
            setDescription(topic.description ?? '');
            setCategories(topic.categories ?? []);
        }
    }, [topic]);

    function handleAddCategory() {
        const val = categoryInput.trim().toLowerCase();
        if (!val || categories.includes(val) || categories.length >= 10) return;
        setCategories((prev) => [...prev, val]);
        setCategoryInput('');
    }

    function handleRemoveCategory(cat: string) {
        setCategories((prev) => prev.filter((c) => c !== cat));
    }

    async function handleUpdate() {
        if (!title.trim()) {
            addToast({ title: 'Campo obrigatório', description: 'O título é obrigatório.', color: 'warning', timeout: 3000, shouldShowTimeoutProgress: true });
            return;
        }
        if (title.trim().length < 4) {
            addToast({ title: 'Título muito curto', description: 'Mínimo 4 caracteres.', color: 'warning', timeout: 3000, shouldShowTimeoutProgress: true });
            return;
        }
        try {
            setIsLoading(true);
            const updated = await topicService.update(topic!.id, {
                title,
                description: description || undefined,
                visibility: topic!.visibility,
                categories,
            });
            addToast({ title: 'Tópico atualizado!', color: 'success', timeout: 3000, shouldShowTimeoutProgress: true });
            onUpdated(updated);
            onClose();
        } catch {
            addToast({ title: 'Erro ao atualizar tópico', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <p className="text-lg font-bold">Editar Tópico</p>
                    <p className="text-sm font-normal text-default-400">Atualize as informações do tópico.</p>
                </ModalHeader>
                <ModalBody className="flex flex-col gap-4">
                    <Input label="Título" value={title} onValueChange={setTitle} isRequired
                        isInvalid={title.length > 0 && title.trim().length < 4} errorMessage="Mínimo 4 caracteres" />
                    <Input label="Descrição" value={description} onValueChange={setDescription} />

                    {/* Categorias */}
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium flex items-center gap-1.5">
                            <Tag size={13} className="text-default-400" />
                            Categorias <span className="text-xs text-default-400">(opcional)</span>
                        </p>
                        <div className="flex gap-2">
                            <Input
                                placeholder="ex: trabalho, pessoal..."
                                value={categoryInput}
                                onValueChange={setCategoryInput}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                                size="sm"
                                className="flex-1"
                            />
                            <Button size="sm" variant="flat" onPress={handleAddCategory} isDisabled={!categoryInput.trim()}>
                                Adicionar
                            </Button>
                        </div>
                        {categories.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {categories.map((cat) => (
                                    <Chip key={cat} size="sm" variant="flat" color="primary"
                                        endContent={
                                            <button onClick={() => handleRemoveCategory(cat)} className="ml-0.5">
                                                <X size={11} />
                                            </button>
                                        }>
                                        {cat}
                                    </Chip>
                                ))}
                            </div>
                        )}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="flat" onPress={onClose} isDisabled={isLoading}>Cancelar</Button>
                    <Button color="primary" onPress={handleUpdate} isLoading={isLoading}>Salvar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}