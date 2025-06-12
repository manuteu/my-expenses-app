import { api } from '@/app/config/axios';
import type { IExpensesResponse } from '../types';

class ExpenseService {
  getExpenses = async () => {
    const response = await api.get<IExpensesResponse>('/expenses');
    return response.data;
  };
}

export const expenseService = new ExpenseService();
