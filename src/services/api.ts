// src/services/api.ts
import axios, { type AxiosInstance, type AxiosResponse, AxiosError } from 'axios';

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError): Promise<never> => {
    const url = error.config?.url ?? '';
    const isLoginRoute = url.includes('/login');
    const isMeRoute = url.includes('/me');

    if (error.response?.status === 401 && !isLoginRoute && !isMeRoute) {
      window.location.href = '/login';
    }
    if (error.response?.status === 403) {
      console.warn('[API] Acesso negado.');
    }
    if (error.response?.status === 500) {
      console.error('[API] Erro interno do servidor.');
    }
    if (!error.response) {
      console.error('[API] Sem resposta do servidor. Verifique sua conexão.');
    }

    return Promise.reject(error);
  }
);

export default api;