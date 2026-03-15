// src/services/authServices.ts
import type { AuthCredentials, User } from '@/types/authTypes';
import { api } from './api';

export const authService = {
  async login(credentials: AuthCredentials): Promise<void> {
    await api.post('/login', credentials);
  },

  async register(credentials: AuthCredentials): Promise<void> {
    await api.post('/users/', credentials);
  },

  async getMe(): Promise<User> {
    const response = await api.get<User>('/me');
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/logout');
  },
};