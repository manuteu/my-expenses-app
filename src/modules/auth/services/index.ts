import { api } from '@/app/config/axios';
import type { LoginSchemaType } from '../components/auth-form';
import type { ILoginResponse } from '../types';

export const authLogin = async (data: LoginSchemaType) => {
  const response = await api.post<ILoginResponse>('/auth/login', data);
  return response.data;
};
