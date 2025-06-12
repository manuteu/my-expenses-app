import { useQuery } from '@tanstack/react-query';
import { methodService } from '../services';

export function useGetMethod() {
  return useQuery({
    queryKey: ['method'],
    queryFn: methodService.getMethods
  });
}
