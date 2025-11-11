import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services';
import type { ICreateCategoryInput } from '../types';

export function useGetCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
    refetchOnWindowFocus: false
  });
}

export function useCreateCategory(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICreateCategoryInput) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onSuccess?.();
    }
  });
}
