import axios from 'axios';
import { storageKeys } from '@/shared/config/storage-keys';
import { env } from '@/env';
import { useAuthStore } from '@/modules/auth/hooks/useAuth';

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
    if (error.response?.status === 401) {
      useAuthStore().logout();
    }
    return Promise.reject(error);
  }
);