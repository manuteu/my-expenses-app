import { useMutation, useQuery } from '@tanstack/react-query';
import { cardService } from '../services';
import { queryClient } from '@/shared/lib/react-query';
export function useGetCards() {
  return useQuery({
    queryKey: ['cards'],
    queryFn: cardService.getCards,
    refetchOnWindowFocus: false
  });
}

export function useCreateCard(onSuccess?: () => void) {
  return useMutation({
    mutationFn: cardService.createCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
    }
  });
}