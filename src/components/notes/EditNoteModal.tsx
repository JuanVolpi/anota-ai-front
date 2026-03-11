import { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Textarea } from '@heroui/input';
import { addToast } from '@heroui/toast';
import { noteService } from '@/services/noteServices';
import type { Note } from '@/types/topicTypes';

interface Props {
    note: Note | null;
    onClose: () => void;
    onUpdated: (note: Note) => void;
}

export function EditNoteModal({ note, onClose, onUpdated }: Props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setDescription(note.description ?? '');
        }
    }, [note]);

    async function handleEdit() {
        if (!note) return;
        if (!title.trim()) {
            addToast({ title: 'Título obrigatório', color: 'warning', timeout: 3000, shouldShowTimeoutProgress: true });
            return;
        }
        if (title.trim().length < 4) {
            addToast({ title: 'Título muito curto', description: 'Mínimo 4 caracteres.', color: 'warning', timeout: 3000, shouldShowTimeoutProgress: true });
            return;
        }
        if (description && description.trim().length < 4) {
            addToast({ title: 'Descrição muito curta', description: 'Mínimo 4 caracteres.', color: 'warning', timeout: 3000, shouldShowTimeoutProgress: true });
            return;
        }
        try {
            setIsSaving(true);
            const updated = await noteService.updateNote(note.id, { title, description: description || undefined });
            onUpdated(updated);
            onClose();
            addToast({ title: 'Nota atualizada!', color: 'success', timeout: 3000, shouldShowTimeoutProgress: true });
        } catch {
            addToast({ title: 'Erro ao atualizar nota', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Modal isOpen={!!note} onClose={onClose} size="lg">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <p className="text-lg font-bold">Editar Nota</p>
                    <p className="text-sm font-normal text-default-400">Atualize os dados da nota.</p>
                </ModalHeader>
                <ModalBody className="flex flex-col gap-4">
                    <Input
                        label="Título"
                        value={title}
                        onValueChange={setTitle}
                        isRequired
                        isInvalid={title.length > 0 && title.trim().length < 4}
                        errorMessage="Mínimo 4 caracteres"
                    />
                    <Textarea
                        label="Descrição"
                        placeholder="Suporta **markdown** como *itálico*, # títulos, - listas..."
                        value={description}
                        onValueChange={setDescription}
                        minRows={6}
                        maxRows={14}
                        isInvalid={description.length > 0 && description.trim().length < 4}
                        errorMessage="Mínimo 4 caracteres"
                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant="flat" onPress={onClose} isDisabled={isSaving}>Cancelar</Button>
                    <Button color="primary" onPress={handleEdit} isLoading={isSaving}>Salvar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}