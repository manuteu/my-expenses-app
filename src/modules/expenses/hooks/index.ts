import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseService } from '../services';
import type { CreateExpenseInput, ExpenseFilters } from '../types';

export function useGetExpenses(
  page: number = 1, 
  limit: number = 10, 
  startDate?: string, 
  endDate?: string,
  filters?: ExpenseFilters
) {
  return useQuery({
    queryKey: ['expenses', page, limit, startDate, endDate, filters],
    queryFn: () => expenseService.getExpenses(page, limit, startDate, endDate, filters),
    refetchOnWindowFocus: false,
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

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ expenseId, scope }: { expenseId: string, scope?: 'all' | null }) => expenseService.deleteExpense(expenseId, scope),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
}
