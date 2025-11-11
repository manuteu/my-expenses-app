import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { methodService } from '../services';
import type { CreateMethodInput } from '../types';

export function useGetMethod() {
  return useQuery({
    queryKey: ['method'],
    queryFn: methodService.getMethods,
    refetchOnWindowFocus: false
  });
}

export function useCreateMethod(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMethodInput) => methodService.createMethod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['method'] });
      onSuccess?.();
    }
  });
}
