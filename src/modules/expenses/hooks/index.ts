import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseService } from '../services';
import type { CreateExpenseInput } from '../types';

export function useGetExpenses(page: number = 1, limit: number = 10, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['expenses', page, limit, startDate, endDate],
    queryFn: () => expenseService.getExpenses(page, limit, startDate, endDate),
    refetchOnWindowFocus: false,
    enabled: !!(startDate && endDate),
  });
}
export function useCreateExpense(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateExpenseInput) =>
      expenseService.createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      onSuccess?.();
    },
  });
}

export function useGetExpensesChart(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['expenses-chart', startDate, endDate],
    queryFn: () => expenseService.getExpensesChart(startDate, endDate),
    refetchOnWindowFocus: false,
    // Só executa a query quando ambas as datas estiverem definidas
    enabled: !!(startDate && endDate),
  });
}

export function useDeleteExpense(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (expenseId: string) => expenseService.deleteExpense(expenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      onSuccess?.();
    },
  });
}
