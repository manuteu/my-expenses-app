import { api } from '@/app/config/axios';
import type {
  IExpensesResponse,
  IExpensesChartResponse,
  Expense,
  CreateExpenseInput,
  ExpenseFilters,
} from '../types';

class ExpenseService {
  getExpenses = async (
    page?: number,
    limit?: number,
    startDate?: string,
    endDate?: string,
    filters?: ExpenseFilters
  ) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    // Adiciona filtros como query params
    if (filters?.description) params.append('description', filters.description);
    if (filters?.methodName) params.append('methodName', filters.methodName);
    if (filters?.type && filters.type !== 'all')
      params.append('type', filters.type);
    if (filters?.categoryName && filters.categoryName !== 'all')
      params.append('categoryName', filters.categoryName);

    const response = await api.get<IExpensesResponse>(
      `/expenses${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data;
  };

  createExpense = async (data: CreateExpenseInput) => {
    const response = await api.post<Expense>('/expenses', data);
    return response.data;
  };

  getExpensesChart = async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const url = `/expenses/chart-data${
      params.toString() ? `?${params.toString()}` : ''
    }`;
    const response = await api.get<IExpensesChartResponse>(url);
    return response.data;
  };
  deleteExpense = async (expenseId: string, scope?: 'all' | null) => {
    const response = await api.delete<Expense>(
      `/expenses/${expenseId}?scope=${scope}`
    );
    return response.data;
  };
}

export const expenseService = new ExpenseService();
