// src/components/notes/CreateNoteModal.tsx
import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input, Textarea } from '@heroui/input';
import { Switch } from '@heroui/switch';
import { DatePicker } from '@heroui/react';
import { addToast } from '@heroui/toast';
import { now, getLocalTimeZone, type DateValue } from '@internationalized/date';
import { Clock } from 'lucide-react';
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
    const [isTemporary, setIsTemporary] = useState(false);
    const [expiresAt, setExpiresAt] = useState<DateValue | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    function handleClose() {
        setTitle('');
        setDescription('');
        setIsTemporary(false);
        setExpiresAt(null);
        onClose();
    }

    async function handleCreate() {
        if (!title.trim()) {
            addToast({
                title: 'Título obrigatório',
                color: 'warning',
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });
            return;
        }

        if (title.trim().length < 4) {
            addToast({
                title: 'Título muito curto',
                description: 'Mínimo 4 caracteres.',
                color: 'warning',
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });
            return;
        }

        if (description && description.trim().length < 4) {
            addToast({
                title: 'Descrição muito curta',
                description: 'Mínimo 4 caracteres.',
                color: 'warning',
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });
            return;
        }

        if (isTemporary && !expiresAt) {
            addToast({
                title: 'Selecione a data de expiração',
                color: 'warning',
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });
            return;
        }

        try {
            setIsSaving(true);

            const expiresAtIso =
                isTemporary && expiresAt
                    ? expiresAt.toDate(getLocalTimeZone()).toISOString()
                    : undefined;

            const payload = {
                title: title.trim(),
                description: description.trim() || undefined,
                expiresAt: expiresAtIso,
            };

            console.log('createNote payload:', payload);

            const note = await noteService.createNote(topicId, payload);

            onCreated(note);
            handleClose();

            addToast({
                title: 'Nota criada!',
                color: 'success',
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });
        } catch (error) {
            console.error('Erro ao criar nota:', error);

            const err = error as {
                response?: {
                    status?: number;
                    data?: {
                        description?: string;
                        message?: string;
                    };
                };
            };

            const description =
                err.response?.data?.description ||
                err.response?.data?.message ||
                'Não foi possível criar a nota.';

            addToast({
                title: 'Erro ao criar nota',
                description,
                color: 'danger',
                timeout: 4000,
                shouldShowTimeoutProgress: true,
            });
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

                    <div className="flex items-center justify-between p-3 rounded-xl border border-divider">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-warning/10">
                                <Clock size={14} className="text-warning" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Nota temporária</p>
                                <p className="text-xs text-default-400">A nota será apagada automaticamente</p>
                            </div>
                        </div>

                        <Switch
                            isSelected={isTemporary}
                            onValueChange={(value) => {
                                setIsTemporary(value);
                                if (!value) setExpiresAt(null);
                            }}
                            color="warning"
                            size="sm"
                        />
                    </div>

                    {isTemporary && (
                        <DatePicker
                            label="Expira em"
                            granularity="minute"
                            minValue={now(getLocalTimeZone())}
                            value={expiresAt}
                            onChange={setExpiresAt}
                            description="Selecione quando a nota deve expirar."
                        />
                    )}
                </ModalBody>

                <ModalFooter>
                    <Button variant="flat" onPress={handleClose} isDisabled={isSaving}>
                        Cancelar
                    </Button>
                    <Button color="primary" onPress={handleCreate} isLoading={isSaving}>
                        Criar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}