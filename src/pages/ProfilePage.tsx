// src/pages/ProfilePage.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Avatar } from '@heroui/avatar';
import { addToast } from '@heroui/toast';
import { useAuth } from '@/contexts/AuthContext';
import {
    User, KeyRound, Copy, Clock,
    EyeIcon, EyeOffIcon, Link,
} from 'lucide-react';
import { userService } from '@/services/userServices';
import { SessionsCard } from '@/contexts/profile/SessionsCard';

export function ProfilePage() {
    const { user } = useAuth();

    const [newUsername, setNewUsername] = useState(user?.username ?? '');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSavingUsername, setIsSavingUsername] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);


    async function handleUpdateUsername() {
        if (!newUsername.trim()) return;
        try {
            setIsSavingUsername(true);
            await userService.updateUsername(newUsername);
            addToast({ title: 'Username atualizado!', color: 'success', timeout: 3000, shouldShowTimeoutProgress: true });
        } catch {
            addToast({ title: 'Erro ao atualizar username', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        } finally {
            setIsSavingUsername(false);
        }
    }

    async function handleUpdatePassword() {
        if (!newPassword || !confirmPassword) {
            addToast({ title: 'Preencha todos os campos', color: 'warning', timeout: 3000, shouldShowTimeoutProgress: true });
            return;
        }
        if (newPassword !== confirmPassword) {
            addToast({ title: 'Senhas não coincidem', color: 'warning', timeout: 3000, shouldShowTimeoutProgress: true });
            return;
        }
        try {
            setIsSavingPassword(true);
            await userService.updatePassword(newPassword);
            setNewPassword('');
            setConfirmPassword('');
            addToast({ title: 'Senha atualizada!', color: 'success', timeout: 3000, shouldShowTimeoutProgress: true });
        } catch {
            addToast({ title: 'Erro ao atualizar senha', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        } finally {
            setIsSavingPassword(false);
        }
    }

    function copyPublicId() {
        navigator.clipboard.writeText(user?.public_id ?? '');
        addToast({ title: 'ID copiado!', color: 'success', timeout: 2000, shouldShowTimeoutProgress: true });
    }

    const expiresAt = user?.expires_at ? new Date(user.expires_at).toLocaleString('pt-PT') : '—';

    return (
        <div className="flex flex-col flex-1 overflow-y-auto px-6 py-8">
            <div className="max-w-2xl mx-auto w-full flex flex-col gap-6">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4"
                >
                    <div className="p-3 rounded-xl bg-default-100">
                        <User size={24} className="text-default-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black">Meu Perfil</h1>
                        <p className="text-sm text-default-400">Suas informações de conta</p>
                    </div>
                </motion.div>

                {/* Info card */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl border border-divider p-6 flex flex-col gap-5"
                >
                    {/* Avatar + nome + roles */}
                    <div className="flex items-center gap-4">
                        <Avatar
                            src={avatarUrl || undefined}
                            showFallback
                            name={user?.username?.charAt(0).toUpperCase()}
                            className="w-16 h-16 text-2xl font-bold bg-primary/20 text-primary"
                        />
                        <div>
                            <p className="text-xl font-bold">{user?.username}</p>
                            <div className="flex gap-1 mt-1 flex-wrap">
                                {user?.roles?.map((role) => (
                                    <Chip key={role} size="sm" variant="flat">
                                        {role.toUpperCase()}
                                    </Chip>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Public ID */}
                    <div className="flex flex-col gap-1">
                        <p className="text-xs text-default-400 uppercase tracking-wider font-semibold">ID Público</p>
                        <div className="flex items-center gap-2">
                            <Input
                                value={user?.public_id ?? ''}
                                isReadOnly={true}
                                size="sm"
                                classNames={{ inputWrapper: 'bg-default-100' }}
                            />
                            <Button isIconOnly size="sm" variant="flat" onPress={copyPublicId}>
                                <Copy size={14} />
                            </Button>
                        </div>
                        <p className="text-xs text-default-400">Compartilhe este ID para ser convidado a tópicos privados.</p>
                    </div>

                    {/* Sessão */}
                    <div className="flex items-center gap-2 text-sm text-default-400">
                        <Clock size={14} />
                        <span>Sessão expira em {expiresAt}</span>
                    </div>
                </motion.div>

                {/* Alterar username */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="rounded-2xl border border-divider p-6 flex flex-col gap-4"
                >
                    <div className="flex items-center gap-3">
                        <User size={18} className="text-default-500" />
                        <div>
                            <p className="font-semibold">Alterar nome de usuário</p>
                            <p className="text-xs text-default-400">O nome de usuário é exibido em toda a plataforma.</p>
                        </div>
                    </div>

                    <Input
                        label="Novo nome de usuário"
                        value={newUsername}
                        onValueChange={setNewUsername}
                    />

                    <Button
                        color="primary"
                        variant="flat"
                        onPress={handleUpdateUsername}
                        isLoading={isSavingUsername}
                        className="self-start"
                    >
                        Salvar
                    </Button>
                </motion.div>


                {/* Alterar senha */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="rounded-2xl border border-divider p-6 flex flex-col gap-4"
                >
                    <div className="flex items-center gap-3">
                        <KeyRound size={18} className="text-default-500" />
                        <div>
                            <p className="font-semibold">Alterar senha</p>
                            <p className="text-xs text-default-400">A senha deve ter entre 8 e 70 caracteres, incluindo maiúscula, minúscula, número e caractere especial.</p>
                        </div>
                    </div>

                    <Input
                        label="Nova senha"
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        minLength={8}
                        maxLength={70}
                        onValueChange={setNewPassword}
                        endContent={
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
                                {showPassword ? <EyeOffIcon size={16} className="text-default-400" /> : <EyeIcon size={16} className="text-default-400" />}
                            </button>
                        }
                    />

                    <Input
                        label="Confirmar nova senha"
                        placeholder="confirmar senha..."
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        minLength={8}
                        maxLength={70}
                        onValueChange={setConfirmPassword}
                        endContent={
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="focus:outline-none">
                                {showConfirm ? <EyeOffIcon size={16} className="text-default-400" /> : <EyeIcon size={16} className="text-default-400" />}
                            </button>
                        }
                    />

                    <Button
                        color="primary"
                        variant="flat"
                        onPress={handleUpdatePassword}
                        isLoading={isSavingPassword}
                        className="self-start"
                    >
                        Salvar
                    </Button>
                </motion.div>

                <SessionsCard />

                {/* Alterar avatar URL */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-2xl border border-divider p-6 flex flex-col gap-4"
                >
                    <div className="flex items-center gap-3">
                        <Link size={18} className="text-default-500" />
                        <div>
                            <p className="font-semibold">Foto de perfil</p>
                            <p className="text-xs text-default-400">Cole um link de imagem para usar como avatar.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Avatar
                            src={avatarUrl || undefined}
                            showFallback
                            name={user?.username?.charAt(0).toUpperCase()}
                            className="w-12 h-12 shrink-0 bg-primary/20 text-primary font-bold"
                        />
                        <Input
                            label="URL da imagem"
                            placeholder="https://..."
                            value={avatarUrl}
                            onValueChange={setAvatarUrl}
                        />
                    </div>

                    <Button color="primary" variant="flat" className="self-start">
                        Salvar
                    </Button>
                </motion.div>

            </div>
        </div>
    );
}