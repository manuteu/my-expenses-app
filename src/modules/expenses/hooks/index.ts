import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseService } from '../services';
import type { CreateExpenseInput } from '../types';

export function useGetExpenses() {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: expenseService.getExpenses,
    refetchOnWindowFocus: false
  });
}

export function useCreateExpense(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseInput) => expenseService.createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      onSuccess?.();
    }
  });
}

export function useGetExpensesChart(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['expenses-chart', startDate, endDate],
    queryFn: () => expenseService.getExpensesChart(startDate, endDate),
    refetchOnWindowFocus: false,
    // Só executa a query quando ambas as datas estiverem definidas
    enabled: !!(startDate && endDate)
  });
}