// src/components/topics/ChangeVisibilityModal.tsx
import { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Alert } from '@heroui/react';
import { addToast } from '@heroui/toast';
import { Globe, Lock, Server, KeyRound, EyeIcon, EyeOffIcon, ShieldCheck } from 'lucide-react';
import { topicService } from '@/services/topicServices';
import type { Topic } from '@/types/topicTypes';

interface Props {
    topic: Topic | null;
    onClose: () => void;
    onUpdated: (topic: Topic) => void;
}

type Tab = 'visibility' | 'passphrase';

export function ChangeVisibilityModal({ topic, onClose, onUpdated }: Props) {
    const [tab, setTab] = useState<Tab>('visibility');

    // Visibility tab
    const [visibility, setVisibility] = useState<'public' | 'private'>('public');
    const [encryptionMode, setEncryptionMode] = useState<'server' | 'passphrase'>('server');
    const [passphrase, setPassphrase] = useState('');
    const [passphraseVisible, setPassphraseVisible] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Passphrase tab
    const [currentPassphrase, setCurrentPassphrase] = useState('');
    const [newPassphrase, setNewPassphrase] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [isChangingPass, setIsChangingPass] = useState(false);

    useEffect(() => {
        if (topic) {
            setVisibility(topic.visibility);
            setEncryptionMode(topic.encryption_mode ?? 'server');
            setPassphrase('');
            setCurrentPassphrase('');
            setNewPassphrase('');
            setTab('visibility');
        }
    }, [topic]);

    function handleClose() {
        setPassphrase('');
        setCurrentPassphrase('');
        setNewPassphrase('');
        onClose();
    }

    async function handleSaveVisibility() {
        if (!topic) return;
        if (visibility === 'private' && encryptionMode === 'passphrase' && !passphrase.trim()) {
            addToast({ title: 'Passphrase obrigatória', color: 'warning', timeout: 3000, shouldShowTimeoutProgress: true });
            return;
        }
        try {
            setIsSaving(true);
            const updated = await topicService.updateVisibility(
                topic.id,
                visibility,
                visibility === 'private' ? encryptionMode : undefined,
                visibility === 'private' && encryptionMode === 'passphrase' ? passphrase : undefined,
            );
            onUpdated(updated);
            handleClose();
            addToast({ title: 'Visibilidade atualizada!', color: 'success', timeout: 3000, shouldShowTimeoutProgress: true });
        } catch {
            addToast({ title: 'Erro ao atualizar visibilidade', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        } finally {
            setIsSaving(false);
        }
    }

    async function handleChangePassphrase() {
        if (!topic) return;
        if (!currentPassphrase.trim() || !newPassphrase.trim()) {
            addToast({ title: 'Preencha todos os campos', color: 'warning', timeout: 3000, shouldShowTimeoutProgress: true });
            return;
        }
        if (newPassphrase.trim().length < 4) {
            addToast({ title: 'Nova passphrase muito curta', description: 'Mínimo 4 caracteres.', color: 'warning', timeout: 3000, shouldShowTimeoutProgress: true });
            return;
        }
        try {
            setIsChangingPass(true);
            const updated = await topicService.updatePassphrase(topic.id, currentPassphrase, newPassphrase);
            onUpdated(updated);
            handleClose();
            addToast({ title: 'Passphrase atualizada!', color: 'success', timeout: 3000, shouldShowTimeoutProgress: true });
        } catch {
            addToast({ title: 'Erro ao alterar passphrase', description: 'Verifique a passphrase atual.', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        } finally {
            setIsChangingPass(false);
        }
    }

    const isPrivate = topic?.visibility === 'private';
    const isPassphraseMode = topic?.encryption_mode === 'passphrase';

    return (
        <Modal isOpen={!!topic} onClose={handleClose} size="md">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-default-100">
                            <Globe size={16} className="text-default-500" />
                        </div>
                        <div>
                            <p className="text-lg font-bold">Alterar visibilidade</p>
                            <p className="text-xs font-normal text-default-400">Altere a visibilidade e o modo de criptografia do tópico.</p>
                        </div>
                    </div>

                    {/* Tabs — só mostra passphrase tab se já for privado com passphrase */}
                    {isPrivate && isPassphraseMode && (
                        <div className="flex gap-1 mt-2 border border-divider rounded-lg p-1">
                            <button
                                onClick={() => setTab('visibility')}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all
                                    ${tab === 'visibility' ? 'bg-primary/10 text-primary' : 'text-default-400 hover:text-foreground'}`}
                            >
                                <Globe size={13} /> Visibilidade
                            </button>
                            <button
                                onClick={() => setTab('passphrase')}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all
                                    ${tab === 'passphrase' ? 'bg-primary/10 text-primary' : 'text-default-400 hover:text-foreground'}`}
                            >
                                <ShieldCheck size={13} /> Passphrase
                            </button>
                        </div>
                    )}
                </ModalHeader>

                <ModalBody className="flex flex-col gap-4">

                    {/* TAB: Visibility */}
                    {tab === 'visibility' && (
                        <>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-semibold">Visibilidade</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setVisibility('public')}
                                        className={`flex flex-col gap-1 p-3 rounded-lg border-2 text-left transition-colors
                                            ${visibility === 'public' ? 'border-primary bg-primary/10' : 'border-divider hover:border-default-400'}`}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <Globe size={14} className={visibility === 'public' ? 'text-primary' : ''} />
                                            <span className="text-sm font-semibold">Público</span>
                                        </div>
                                        <span className="text-xs text-default-400">Visível para todos</span>
                                    </button>

                                    <button
                                        onClick={() => setVisibility('private')}
                                        className={`flex flex-col gap-1 p-3 rounded-lg border-2 text-left transition-colors
                                            ${visibility === 'private' ? 'border-warning bg-warning/10' : 'border-divider hover:border-default-400'}`}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <Lock size={14} className={visibility === 'private' ? 'text-warning' : ''} />
                                            <span className="text-sm font-semibold">Privado</span>
                                        </div>
                                        <span className="text-xs text-default-400">Visível apenas para membros</span>
                                    </button>
                                </div>
                            </div>

                            {/* Encryption — só se for privado */}
                            {visibility === 'private' && (
                                <>
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm font-semibold">Criptografia</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => setEncryptionMode('server')}
                                                className={`flex flex-col gap-1 p-3 rounded-lg border-2 text-left transition-colors
                                                    ${encryptionMode === 'server' ? 'border-primary bg-primary/10' : 'border-divider hover:border-default-400'}`}
                                            >
                                                <div className="flex items-center gap-1.5">
                                                    <Server size={14} />
                                                    <span className="text-sm font-semibold">Servidor</span>
                                                </div>
                                                <span className="text-xs text-default-400">Automática, sem senha extra</span>
                                            </button>

                                            <button
                                                onClick={() => setEncryptionMode('passphrase')}
                                                className={`flex flex-col gap-1 p-3 rounded-lg border-2 text-left transition-colors
                                                    ${encryptionMode === 'passphrase' ? 'border-primary bg-primary/10' : 'border-divider hover:border-default-400'}`}
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
                                            <Alert color="warning" variant="faded" title="Atenção: passphrase irrecuperável">
                                                <span className="text-xs">Se perdida, as notas não poderão ser acessadas por ninguém.</span>
                                            </Alert>
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    )}

                    {/* TAB: Passphrase */}
                    {tab === 'passphrase' && (
                        <>
                            <Input
                                label="Passphrase atual"
                                type={showCurrent ? 'text' : 'password'}
                                value={currentPassphrase}
                                onValueChange={setCurrentPassphrase}
                                endContent={
                                    <button type="button" onClick={() => setShowCurrent(!showCurrent)}>
                                        {showCurrent ? <EyeOffIcon size={16} className="text-default-400" /> : <EyeIcon size={16} className="text-default-400" />}
                                    </button>
                                }
                            />
                            <Input
                                label="Nova passphrase"
                                type={showNew ? 'text' : 'password'}
                                value={newPassphrase}
                                onValueChange={setNewPassphrase}
                                isInvalid={newPassphrase.length > 0 && newPassphrase.trim().length < 4}
                                errorMessage="Mínimo 4 caracteres"
                                endContent={
                                    <button type="button" onClick={() => setShowNew(!showNew)}>
                                        {showNew ? <EyeOffIcon size={16} className="text-default-400" /> : <EyeIcon size={16} className="text-default-400" />}
                                    </button>
                                }
                            />
                            <Alert color="warning" variant="faded" title="Atenção">
                                <span className="text-xs">A nova passphrase será necessária para acessar as notas deste tópico.</span>
                            </Alert>
                        </>
                    )}

                </ModalBody>

                <ModalFooter>
                    <Button variant="flat" onPress={handleClose} isDisabled={isSaving || isChangingPass}>
                        Cancelar
                    </Button>
                    {tab === 'visibility' ? (
                        <Button color="primary" onPress={handleSaveVisibility} isLoading={isSaving}>
                            Salvar
                        </Button>
                    ) : (
                        <Button color="primary" onPress={handleChangePassphrase} isLoading={isChangingPass}>
                            Alterar passphrase
                        </Button>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}