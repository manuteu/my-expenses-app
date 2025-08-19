import { useQuery } from '@tanstack/react-query';
import { expenseService } from '../services';

export function useGetExpenses() {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: expenseService.getExpenses,
    refetchOnWindowFocus: false
  });
}
