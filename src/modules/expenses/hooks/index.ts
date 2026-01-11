import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseAnalysisService, expenseService } from '../services';
import type { CreateExpenseInput, UpdateExpenseInput, ExpenseFilters } from '../types';

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


export function useGetPendingCount(filters?: ExpenseFilters) {
  return useQuery({
    queryKey: ['pending-count', filters],
    queryFn: () => expenseAnalysisService.getPendingCount(filters),
    refetchOnWindowFocus: false,
  });
}

export function useGetPendingTotalAmount(filters?: ExpenseFilters) {
  return useQuery({
    queryKey: ['pending-total-amount', filters],
    queryFn: () => expenseAnalysisService.getPendingTotalAmount(filters),
    refetchOnWindowFocus: false,
  });
}

export function useGetMonthlyAnalysis(filters?: ExpenseFilters) {
  return useQuery({
    queryKey: ['monthly-analysis', filters],
    queryFn: () => expenseAnalysisService.getMonthlyAnalysis(filters),
    refetchOnWindowFocus: false,
  });
}

export function useUpdateExpense(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ expenseId, data }: { expenseId: string, data: UpdateExpenseInput }) => 
      expenseService.updateExpense(expenseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      onSuccess?.();
    },
  });
}