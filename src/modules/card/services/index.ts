import { api } from '@/app/config/axios';
import type { ICardsResponse, ICreateCardInput } from '../types';

class CardService {
  getCards = async () => {
    const response = await api.get<ICardsResponse[]>('/card');
    return response.data;
  };

  createCard = async (data: ICreateCardInput) => {
    const response = await api.post<ICardsResponse>('/card', data);
    return response.data;
  };
}

export const cardService = new CardService();
