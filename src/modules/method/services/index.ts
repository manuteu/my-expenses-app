import { api } from '@/app/config/axios';
import type { IMethodResponse, PaymentMethod, CreateMethodInput } from '../types';

class MethodService {
  getMethods = async () => {
    const response = await api.get<IMethodResponse>('/methods');
    return response.data;
  };

  createMethod = async (data: CreateMethodInput) => {
    const response = await api.post<PaymentMethod>('/methods', data);
    return response.data;
  };
}

export const methodService = new MethodService();
