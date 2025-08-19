import { api } from '@/app/config/axios';
import type { LoginSchemaType } from '../components/auth-form';
import type { RegisterSchemaType } from '../components/register-form';
import type { ILoginResponse } from '../types';

export const authLogin = async (data: LoginSchemaType) => {
  const response = await api.post<ILoginResponse>('/auth/login', data);
  return response.data;
};

export const authRegister = async (data: RegisterSchemaType) => {
  // Ajuste o endpoint conforme sua API
  const response = await api.post<{ token: string }>('/auth/register', data);
  return response.data;
};

export function logout() {
  sessionStorage.clear();
  window.location.href = '/';
}
