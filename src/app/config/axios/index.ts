import axios from 'axios';
import { storageKeys } from '@/shared/config/storage-keys';
import { env } from '@/env';
import authStore from '@/modules/auth/hooks/useAuth';

const baseURL = env.VITE_ENVIRONMENT === 'PROD' ? env.VITE_API_URL : 'http://localhost:3000';

export const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(storageKeys.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Verifica se o erro é de token inválido ou expirado
    const errorMessage = error.response?.data?.error;
    const isTokenError = errorMessage === 'Token inválido ou expirado';
    const isUnauthorized = error.response?.status === 401;

    if (isTokenError || isUnauthorized) {
      // Usa o store diretamente sem hook
      authStore.getState().logout();
      
      // Redireciona para a página de login
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);