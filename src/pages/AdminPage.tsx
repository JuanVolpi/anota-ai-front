// src/pages/AdminPage.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Avatar } from '@heroui/avatar';
import { Divider } from '@heroui/divider';
import { addToast } from '@heroui/toast';
import { userService } from '@/services/userServices';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import type { User } from '@/types/authTypes';
import {
    ShieldCheck, UserPlus, Search,
    EyeIcon, EyeOffIcon, Clock, User as UserIcon,
} from 'lucide-react';

export function AdminPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Guard: só admins
    useEffect(() => {
        if (user && !user.roles?.includes('ADMIN')) {
            navigate('/topics');
        }
    }, [user]);

    // Create user
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Search user
    const [searchId, setSearchId] = useState('');
    const [foundUser, setFoundUser] = useState<User | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [notFound, setNotFound] = useState(false);

    async function handleCreateUser() {
        if (!newUsername.trim()) {
            addToast({ title: 'Username obrigatório', color: 'warning', timeout: 3000, shouldShowTimeoutProgress: true });
            return;
        }
        if (newUsername.trim().length < 4) {
            addToast({ title: 'Username muito curto', description: 'Mínimo 4 caracteres.', color: 'warning', timeout: 3000, shouldShowTimeoutProgress: true });
            return;
        }
        if (!newPassword) {
            addToast({ title: 'Senha obrigatória', color: 'warning', timeout: 3000, shouldShowTimeoutProgress: true });
            return;
        }
        if (newPassword !== confirmPassword) {
            addToast({ title: 'Senhas não coincidem', color: 'warning', timeout: 3000, shouldShowTimeoutProgress: true });
            return;
        }
        try {
            setIsCreating(true);
            await userService.createUser(newUsername.trim(), newPassword);
            setNewUsername('');
            setNewPassword('');
            setConfirmPassword('');
            addToast({ title: 'Usuário criado!', color: 'success', timeout: 3000, shouldShowTimeoutProgress: true });
        } catch {
            addToast({ title: 'Erro ao criar usuário', description: 'Username pode já estar em uso.', color: 'danger', timeout: 3000, shouldShowTimeoutProgress: true });
        } finally {
            setIsCreating(false);
        }
    }

    async function handleSearchUser() {
        if (!searchId.trim()) return;
        try {
            setIsSearching(true);
            setNotFound(false);
            setFoundUser(null);
            const found = await userService.getById(searchId.trim());
            setFoundUser(found);
        } catch {
            setNotFound(true);
        } finally {
            setIsSearching(false);
        }
    }

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
                        <ShieldCheck size={24} className="text-default-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black">Administração</h1>
                        <p className="text-sm text-default-400">Gerencie usuários e configurações do sistema</p>
                    </div>
                </motion.div>

                {/* Criar usuário */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl border border-divider p-6 flex flex-col gap-5"
                >
                    <div className="flex items-center gap-3">
                        <UserPlus size={18} className="text-default-500" />
                        <div>
                            <p className="font-semibold">Criar Novo Usuário</p>
                            <p className="text-xs text-default-400">Preencha os dados abaixo para criar um novo usuário no sistema.</p>
                        </div>
                    </div>

                    <Divider />

                    <div className="flex flex-col gap-3">
                        <Input
                            label="Username"
                            value={newUsername}
                            onValueChange={setNewUsername}
                            isInvalid={newUsername.length > 0 && newUsername.trim().length < 4}
                            errorMessage="Mínimo 4 caracteres"
                        />
                        <Input
                            label="Senha"
                            type={showPassword ? 'text' : 'password'}
                            value={newPassword}
                            onValueChange={setNewPassword}
                            endContent={
                                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword
                                        ? <EyeOffIcon size={16} className="text-default-400" />
                                        : <EyeIcon size={16} className="text-default-400" />
                                    }
                                </button>
                            }
                        />
                        <Input
                            label="Confirmar Senha"
                            placeholder="confirme a senha..."
                            type={showConfirm ? 'text' : 'password'}
                            value={confirmPassword}
                            onValueChange={setConfirmPassword}
                            isInvalid={confirmPassword.length > 0 && confirmPassword !== newPassword}
                            errorMessage="Senhas não coincidem"
                            endContent={
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
                                    {showConfirm
                                        ? <EyeOffIcon size={16} className="text-default-400" />
                                        : <EyeIcon size={16} className="text-default-400" />
                                    }
                                </button>
                            }
                        />
                    </div>

                    <Button
                        color="primary"
                        onPress={handleCreateUser}
                        isLoading={isCreating}
                        fullWidth
                    >
                        Criar Usuário
                    </Button>
                </motion.div>

                {/* Buscar usuário */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="rounded-2xl border border-divider p-6 flex flex-col gap-5"
                >
                    <div className="flex items-center gap-3">
                        <Search size={18} className="text-default-500" />
                        <div>
                            <p className="font-semibold">Buscar Usuário</p>
                            <p className="text-xs text-default-400">Consulte informações de um usuário pelo ID.</p>
                        </div>
                    </div>

                    <Divider />

                    <div className="flex gap-2">
                        <Input
                            placeholder="ID do usuário..."
                            value={searchId}
                            onValueChange={(v) => { setSearchId(v); setFoundUser(null); setNotFound(false); }}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchUser()}
                            className="flex-1"
                        />
                        <Button
                            isIconOnly
                            variant="flat"
                            onPress={handleSearchUser}
                            isLoading={isSearching}
                        >
                            <Search size={16} />
                        </Button>
                    </div>

                    {/* Resultado */}
                    {notFound && (
                        <div className="flex items-center justify-center py-4 text-sm text-default-400">
                            Nenhum usuário encontrado com este ID.
                        </div>
                    )}

                    {foundUser && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-xl border border-divider p-4 flex flex-col gap-4"
                        >
                            <div className="flex items-center gap-3">
                                <Avatar
                                    showFallback
                                    name={foundUser.username.charAt(0).toUpperCase()}
                                    className="w-12 h-12 text-lg font-bold bg-primary/20 text-primary"
                                />
                                <div className="flex-1">
                                    <p className="font-bold">{foundUser.username}</p>
                                    <div className="flex gap-1 mt-1 flex-wrap">
                                        {foundUser.roles?.map((role) => (
                                            <Chip key={role} size="sm" variant="flat">
                                                {role.toUpperCase()}
                                            </Chip>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Divider />

                            <div className="grid grid-cols-1 gap-2 text-sm">
                                <div className="flex items-center gap-2 text-default-400">
                                    <UserIcon size={14} />
                                    <span className="text-default-300">ID interno:</span>
                                    <span className="font-mono text-xs">{foundUser.user_id}</span>
                                </div>
                                <div className="flex items-center gap-2 text-default-400">
                                    <Search size={14} />
                                    <span className="text-default-300">ID público:</span>
                                    <span className="font-mono text-xs">{foundUser.public_id}</span>
                                </div>
                                {foundUser.expires_at && (
                                    <div className="flex items-center gap-2 text-default-400">
                                        <Clock size={14} />
                                        <span className="text-default-300">Sessão expira:</span>
                                        <span className="text-xs">{new Date(foundUser.expires_at).toLocaleString('pt-PT')}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </motion.div>

            </div>
        </div>
    );
}