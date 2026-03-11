import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Textarea } from '@heroui/input';
import { addToast } from '@heroui/toast';
import type { Note } from '@/types/topicTypes';
import { noteService } from '@/services/noteServices';

interface Props {
    isOpen: boolean;
    topicId: string;
    onClose: () => void;
    onCreated: (note: Note) => void;
}

export function CreateNoteModal({ isOpen, topicId, onClose, onCreated }: Props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    function handleClose() {
        setTitle('');
        setDescription('');
        onClose();
    }

    async function handleCreate() {
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
            const note = await noteService.createNote(topicId, { title, description: description || undefined });
            onCreated(note);
            handleClose();
            addToast({ title: 'Nota criada!', color: 'success', timeout: 3000, shouldShowTimeoutProgress: true });
        } catch {
            addToast({ title: 'Erro ao criar nota', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <p className="text-lg font-bold">Nova Nota</p>
                    <p className="text-sm font-normal text-default-400">Adicione uma nota ao tópico.</p>
                </ModalHeader>
                <ModalBody className="flex flex-col gap-4">
                    <Input
                        label="Título"
                        placeholder="Título da nota"
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
                    <Button variant="flat" onPress={handleClose} isDisabled={isSaving}>Cancelar</Button>
                    <Button color="primary" onPress={handleCreate} isLoading={isSaving}>Criar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}