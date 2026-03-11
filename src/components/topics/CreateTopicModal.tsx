// src/components/topics/CreateTopicModal.tsx
import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Switch } from '@heroui/switch';
import { addToast } from '@heroui/toast';
import { Server, KeyRound, EyeIcon, EyeOffIcon, HatGlasses } from 'lucide-react';
import type { Topic } from '@/types/topicTypes';
import { topicService } from '@/services/topicServices';
import { Alert } from '@heroui/react';

interface CreateTopicModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated: (topic: Topic) => void;
}

export function CreateTopicModal({ isOpen, onClose, onCreated }: CreateTopicModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [encryptionMode, setEncryptionMode] = useState<'server' | 'passphrase'>('server');
    const [passphrase, setPassphrase] = useState('');
    const [passphraseVisible, setPassphraseVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    function handleClose() {
        setTitle('');
        setDescription('');
        setIsPrivate(false);
        setEncryptionMode('server');
        setPassphrase('');
        onClose();
    }

    async function handleCreate() {
        if (!title.trim()) {
            addToast({ title: 'Campo obrigatório', description: 'O título é obrigatório.', color: 'warning', timeout: 3000, shouldShowTimeoutProgress: true });
            return;
        }

        if (title.trim().length < 4) {
            addToast({ title: 'Título muito curto', description: 'O título deve ter pelo menos 4 caracteres.', color: 'warning', timeout: 3000, shouldShowTimeoutProgress: true });
            return;
        }

        if (description && description.trim().length < 4) {
            addToast({ title: 'Descrição muito curta', description: 'A descrição deve ter pelo menos 4 caracteres.', color: 'warning', timeout: 3000, shouldShowTimeoutProgress: true });
            return;
        }

        if (isPrivate && encryptionMode === 'passphrase' && !passphrase.trim()) {
            addToast({
                title: 'Passphrase obrigatória',
                description: 'Defina uma passphrase para continuar.',
                color: 'warning',
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });
            return;
        }

        try {
            setIsLoading(true);
            const topic = await topicService.create(
                {
                    title,
                    description: description || undefined,
                    visibility: isPrivate ? 'private' : 'public',
                    encryptionMode: isPrivate ? encryptionMode : undefined,
                },
                isPrivate && encryptionMode === 'passphrase' ? passphrase : undefined,
            );

            addToast({
                title: 'Tópico criado!',
                color: 'success',
                timeout: 3000,
                shouldShowTimeoutProgress: true,
            });

            onCreated(topic);
            handleClose();
        } catch {
            addToast({
                title: 'Erro ao criar tópico',
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
                    <p className="text-lg font-bold">Novo Tópico</p>
                    <p className="text-sm font-normal text-default-400">Preencha os dados do novo tópico.</p>
                </ModalHeader>

                <ModalBody className="flex flex-col gap-4">
                    <Input
                        label="Título"
                        placeholder="Ex: Reunião de equipe"
                        minLength={4}
                        value={title}
                        onValueChange={setTitle}
                        isRequired
                    />

                    <Input
                        label="Descrição"
                        placeholder="Descreva o tópico..."
                        minLength={4}
                        value={description}
                        onValueChange={setDescription}
                    />

                    <Alert variant={'bordered'} title={"Privacidade"} icon={<HatGlasses strokeWidth={'1px'} size={20} />} endContent={
                        <Switch
                            isSelected={isPrivate}
                            onValueChange={setIsPrivate}
                            classNames={{ label: 'flex flex-col gap-0.5' }}
                        >

                        </Switch>
                    }>
                        <span className="text-xs text-default-400">
                            {isPrivate ? 'Visível apenas para membros' : 'Visível para todos'}
                        </span>
                    </Alert>




                    {isPrivate && (
                        <>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium">Criptografia</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setEncryptionMode('server')}
                                        className={`flex flex-col gap-1 p-3 rounded-lg border-2 text-left transition-colors ${encryptionMode === 'server'
                                            ? 'border-primary bg-primary/10'
                                            : 'border-divider hover:border-default-400'
                                            }`}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <Server size={14} />
                                            <span className="text-sm font-semibold">Servidor</span>
                                        </div>
                                        <span className="text-xs text-default-400">Automática, sem senha extra</span>
                                    </button>

                                    <button
                                        onClick={() => setEncryptionMode('passphrase')}
                                        className={`flex flex-col gap-1 p-3 rounded-lg border-2 text-left transition-colors ${encryptionMode === 'passphrase'
                                            ? 'border-primary bg-primary/10'
                                            : 'border-divider hover:border-default-400'
                                            }`}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <KeyRound size={14} />
                                            <span className="text-sm font-semibold">Passphrase</span>
                                        </div>
                                        <span className="text-xs text-default-400">Senha definida por você</span>
                                    </button>
                                </div>
                            </div>

                            {encryptionMode === 'passphrase' && (
                                <>
                                    <Input
                                        label="Passphrase"
                                        placeholder="••••••••••••"
                                        type={passphraseVisible ? 'text' : 'password'}
                                        value={passphrase}
                                        onValueChange={setPassphrase}
                                        endContent={
                                            <button type="button" onClick={() => setPassphraseVisible(!passphraseVisible)}>
                                                {passphraseVisible
                                                    ? <EyeOffIcon size={16} className="text-default-400" />
                                                    : <EyeIcon size={16} className="text-default-400" />
                                                }
                                            </button>
                                        }
                                    />

                                    <Alert
                                        color="warning"
                                        variant="faded"
                                        title="Atenção: passphrase irrecuperável"

                                    > <span className="text-xs">
                                            Se perdida, as notas não poderão ser acessadas por ninguém.
                                        </span>
                                    </Alert>
                                </>
                            )}
                        </>
                    )}
                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onPress={handleCreate} isLoading={isLoading} fullWidth>
                        Criar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal >
    );
}