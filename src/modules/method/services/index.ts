import { api } from '@/app/config/axios';
import type { IMethodResponse } from '../types';

class MethodService {
  getMethods = async () => {
    const response = await api.get<IMethodResponse>('/methods');
    return response.data;
  };
}

export const methodService = new MethodService();
