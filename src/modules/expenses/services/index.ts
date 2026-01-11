import { api } from '@/app/config/axios';
import type {
  IExpensesResponse,
  IExpensesChartResponse,
  Expense,
  CreateExpenseInput,
  UpdateExpenseInput,
  ExpenseFilters,
  IPendingCountResponse,
  IPendingTotalAmountResponse,
  IMonthlyAnalysisResponse,
} from '../types';

const BASE_URL = '/expenses';
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
      `${BASE_URL}${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data;
  };

  createExpense = async (data: CreateExpenseInput) => {
    const response = await api.post<Expense>(`${BASE_URL}`, data);
    return response.data;
  };

  getExpensesChart = async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const url = `${BASE_URL}/chart-data${
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

  updateExpense = async (expenseId: string, data: UpdateExpenseInput) => {
    const response = await api.patch<Expense>(`${BASE_URL}/${expenseId}`, data);
    return response.data;
  };
}

class ExpenseAnalysisService {
  getPendingCount = async (
    filters?: ExpenseFilters
  ) => {
    const params = new URLSearchParams();
    // Adiciona filtros como query params
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.methodId) params.append('methodId', filters.methodId);
    if (filters?.type && filters.type !== 'all')
      params.append('type', filters.type);

    const response = await api.get<IPendingCountResponse>(
      `${BASE_URL}/analysis/pending-count${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data;
  };

  getPendingTotalAmount = async (
    filters?: ExpenseFilters
  ) => {
    const params = new URLSearchParams();
    // Adiciona filtros como query params
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.methodId) params.append('methodId', filters.methodId);
    if (filters?.type && filters.type !== 'all')
      params.append('type', filters.type);

    const response = await api.get<IPendingTotalAmountResponse>(
      `${BASE_URL}/analysis/pending-total${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data;
  };

  getMonthlyAnalysis = async (
    filters?: ExpenseFilters
  ) => {
    const params = new URLSearchParams();
    // Adiciona filtros como query params
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.methodId) params.append('methodId', filters.methodId);
    if (filters?.type && filters.type !== 'all')
      params.append('type', filters.type);

    const response = await api.get<IMonthlyAnalysisResponse>(
      `${BASE_URL}/analysis/monthly${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data;
  };
}

export const expenseService = new ExpenseService();
export const expenseAnalysisService = new ExpenseAnalysisService();