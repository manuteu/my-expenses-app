import { api } from '@/app/config/axios';
import type { ICardsResponse } from '../types';

class CardService {
  getCards = async () => {
    const response = await api.get<ICardsResponse[]>('/card');
    return response.data;
  };
}

export const cardService = new CardService();
