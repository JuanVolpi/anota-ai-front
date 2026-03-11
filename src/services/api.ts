// src/services/api.ts
import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';

const TOKEN_KEY = '@SimpleNote:token';

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<never> => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: AxiosError): Promise<never> => {
    const isLoginRoute = error.config?.url === '/login';

    if (error.response?.status === 401 && !isLoginRoute) {
      localStorage.removeItem(TOKEN_KEY);
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