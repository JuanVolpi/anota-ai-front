import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';
import { addToast } from '@heroui/toast';
import { BookOpen } from 'lucide-react';
import { noteService } from '@/services/noteServices';
import type { Note } from '@/types/topicTypes';
import { useState } from 'react';

interface Props {
    note: Note | null;
    onClose: () => void;
    onDeleted: (noteId: string) => void;
}

export function DeleteNoteModal({ note, onClose, onDeleted }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        if (!note) return;
        try {
            setIsDeleting(true);
            await noteService.deleteNote(note.id);
            onDeleted(note.id);
            onClose();
            addToast({ title: 'Nota deletada!', color: 'success', timeout: 3000, shouldShowTimeoutProgress: true });
        } catch {
            addToast({ title: 'Erro ao deletar nota', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <Modal isOpen={!!note} onClose={onClose} size="sm">
            <ModalContent>
                <ModalHeader>Deletar Nota</ModalHeader>
                <ModalBody className="flex flex-col items-center gap-4 py-4">
                    <div className="p-4 rounded-full bg-danger/10">
                        <BookOpen size={28} className="text-danger" />
                    </div>
                    <div className="text-center">
                        <p className="font-medium">Tem certeza?</p>
                        <p className="text-sm text-default-400 mt-1">
                            <span className="font-semibold text-foreground">"{note?.title}"</span> será deletada permanentemente.
                        </p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="flat" onPress={onClose} fullWidth isDisabled={isDeleting}>Cancelar</Button>
                    <Button color="danger" onPress={handleDelete} fullWidth isLoading={isDeleting}>Deletar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}