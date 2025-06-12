import { useQuery } from '@tanstack/react-query';
import { cardService } from '../services';

export function useGetCards() {
  return useQuery({
    queryKey: ['cards'],
    queryFn: cardService.getCards
  });
}
