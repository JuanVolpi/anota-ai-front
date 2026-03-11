// src/services/authService.ts
import type { AuthCredentials, LoginResponse, User } from '@/types/authTypes';
import { api } from './api';

export const authService = {
  async login(credentials: AuthCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/login', credentials);
    return response.data;
  },

  async register(credentials: AuthCredentials): Promise<void> {
    // O backend pede a senha com regras fortes (regex no swagger)
    await api.post('/users/', credentials);
  },

  async getMe(): Promise<User> {
    const response = await api.get<User>('/me');
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/logout');
  }
};