// src/components/topics/CreateTopicModal.tsx
import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Switch } from '@heroui/switch';
import { Chip } from '@heroui/chip';
import { addToast } from '@heroui/toast';
import { Server, KeyRound, EyeIcon, EyeOffIcon, HatGlasses, Tag, X } from 'lucide-react';
import type { Topic } from '@/types/topicTypes';
import { topicService } from '@/services/topicServices';
import { Alert } from '@heroui/react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onCreated: (topic: Topic) => void;
}

export function CreateTopicModal({ isOpen, onClose, onCreated }: Props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(true);
    const [encryptionMode, setEncryptionMode] = useState<'server' | 'passphrase'>('server');
    const [passphrase, setPassphrase] = useState('');
    const [passphraseVisible, setPassphraseVisible] = useState(false);
    const [categoryInput, setCategoryInput] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    function handleClose() {
        setTitle(''); setDescription(''); setIsPrivate(false);
        setEncryptionMode('server'); setPassphrase('');
        setCategoryInput(''); setCategories([]);
        onClose();
    }

    function handleAddCategory() {
        const val = categoryInput.trim().toLowerCase();
        if (!val || categories.includes(val) || categories.length >= 10) return;
        setCategories((prev) => [...prev, val]);
        setCategoryInput('');
    }

    function handleRemoveCategory(cat: string) {
        setCategories((prev) => prev.filter((c) => c !== cat));
    }

    async function handleCreate() {
        if (!title.trim()) {
            addToast({ title: 'Campo obrigatório', description: 'O título é obrigatório.', color: 'warning', timeout: 3000, shouldShowTimeoutProgress: true });
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
        if (isPrivate && encryptionMode === 'passphrase' && !passphrase.trim()) {
            addToast({ title: 'Passphrase obrigatória', color: 'warning', timeout: 3000, shouldShowTimeoutProgress: true });
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
                    categories: categories.length > 0 ? categories : undefined,
                },
                isPrivate && encryptionMode === 'passphrase' ? passphrase : undefined,
            );
            addToast({ title: 'Tópico criado!', color: 'success', timeout: 3000, shouldShowTimeoutProgress: true });
            onCreated(topic);
            handleClose();
        } catch {
            addToast({ title: 'Erro ao criar tópico', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
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
                    <Input label="Título" placeholder="Ex: Reunião de equipe" value={title} onValueChange={setTitle} isRequired
                        isInvalid={title.length > 0 && title.trim().length < 4} errorMessage="Mínimo 4 caracteres" />
                    <Input label="Descrição" placeholder="Descreva o tópico..." value={description} onValueChange={setDescription}
                        isInvalid={description.length > 0 && description.trim().length < 4} errorMessage="Mínimo 4 caracteres" />

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
                                    <Chip
                                        key={cat}
                                        size="sm"
                                        variant="flat"
                                        color="primary"
                                        endContent={
                                            <button onClick={() => handleRemoveCategory(cat)} className="ml-0.5">
                                                <X size={11} />
                                            </button>
                                        }
                                    >
                                        {cat}
                                    </Chip>
                                ))}
                            </div>
                        )}
                    </div>



                    <Alert variant="bordered" title="Privacidade" icon={<HatGlasses strokeWidth="1px" size={20} />}
                        endContent={<Switch isSelected={isPrivate} onValueChange={setIsPrivate} />}>
                        <span className="text-xs text-default-400">
                            {isPrivate ? 'Visível apenas para membros' : 'Visível para todos'}
                        </span>
                    </Alert>

                    {isPrivate ? (
                        <>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium">Criptografia</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => setEncryptionMode('server')}
                                        className={`flex flex-col gap-1 p-3 rounded-lg border-2 text-left transition-colors ${encryptionMode === 'server' ? 'border-primary bg-primary/10' : 'border-divider hover:border-default-400'}`}>
                                        <div className="flex items-center gap-1.5"><Server size={14} /><span className="text-sm font-semibold">Servidor</span></div>
                                        <span className="text-xs text-default-400">Automática, sem senha extra</span>
                                    </button>
                                    <button onClick={() => setEncryptionMode('passphrase')}
                                        className={`flex flex-col gap-1 p-3 rounded-lg border-2 text-left transition-colors ${encryptionMode === 'passphrase' ? 'border-primary bg-primary/10' : 'border-divider hover:border-default-400'}`}>
                                        <div className="flex items-center gap-1.5"><KeyRound size={14} /><span className="text-sm font-semibold">Passphrase</span></div>
                                        <span className="text-xs text-default-400">Senha definida por você</span>
                                    </button>
                                </div>
                            </div>
                            {encryptionMode === 'passphrase' && (
                                <>
                                    <Input label="Passphrase" placeholder="••••••••••••"
                                        type={passphraseVisible ? 'text' : 'password'}
                                        value={passphrase} onValueChange={setPassphrase}
                                        endContent={
                                            <button type="button" onClick={() => setPassphraseVisible(!passphraseVisible)}>
                                                {passphraseVisible ? <EyeOffIcon size={16} className="text-default-400" /> : <EyeIcon size={16} className="text-default-400" />}
                                            </button>
                                        } />
                                    <Alert color="warning" variant="faded" title="Atenção: passphrase irrecuperável">
                                        <span className="text-xs">Se perdida, as notas não poderão ser acessadas por ninguém.</span>
                                    </Alert>
                                </>
                            )}
                        </>
                    ) : (<Alert color="warning" variant="faded" title="Atenção: Tópico público">
                        <span className="text-xs">Se público, todos os usuários vão conseguir ver este tópico.</span>
                    </Alert>)}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onPress={handleCreate} isLoading={isLoading} fullWidth>Criar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}