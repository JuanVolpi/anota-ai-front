// src/services/userService.ts
import { api } from './api';
import type { User } from '@/types/authTypes';

export const userService = {
    async updateUsername(username: string): Promise<User> {
        const response = await api.patch<User>('/users/me/username', { username });
        return response.data;
    },

    async updatePassword(password: string): Promise<User> {
        const response = await api.patch<User>('/users/me/password', { password });
        return response.data;
    },

    async getById(id: string): Promise<User> {
        const response = await api.get<User>(`/users/${id}`);
        return response.data;
    },

    async createUser(username: string, password: string): Promise<User> {
        const response = await api.post<User>('/users/', { username, password });
        return response.data;
    },

};