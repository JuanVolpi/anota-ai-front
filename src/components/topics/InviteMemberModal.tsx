import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { addToast } from '@heroui/toast';
import { topicService } from '@/services/topicServices';

interface Props {
    isOpen: boolean;
    topicId: string;
    onClose: () => void;
    onInvited: () => void;
}

export function InviteMemberModal({ isOpen, topicId, onClose, onInvited }: Props) {
    const [publicId, setPublicId] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    function handleClose() {
        setPublicId('');
        onClose();
    }

    async function handleInvite() {
        if (!publicId.trim()) {
            addToast({ title: 'ID obrigatório', color: 'warning', timeout: 3000, shouldShowTimeoutProgress: true });
            return;
        }
        try {
            setIsLoading(true);
            await topicService.addMember(topicId, publicId.trim());
            addToast({ title: 'Membro convidado!', color: 'success', timeout: 3000, shouldShowTimeoutProgress: true });
            onInvited();
            handleClose();
        } catch {
            addToast({ title: 'Erro ao convidar membro', description: 'Verifique o ID e tente novamente.', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="sm">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <p className="text-lg font-bold">Convidar membro</p>
                    <p className="text-sm font-normal text-default-400">
                        Informe o ID público do usuário a ser convidado (ex: swift-fox-4271).
                    </p>
                </ModalHeader>
                <ModalBody>
                    <Input
                        placeholder="swift-fox-4271"
                        value={publicId}
                        onValueChange={setPublicId}
                        onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant="flat" onPress={handleClose} isDisabled={isLoading}>Cancelar</Button>
                    <Button color="primary" onPress={handleInvite} isLoading={isLoading}>Convidar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}