import { useMutation } from '@tanstack/react-query';
import { authRegister } from '../services';
import type { RegisterSchemaType } from '../components/register-form';

export function useRegisterMutation(onSuccess?: (data: { token: string }) => void) {
  return useMutation({
    mutationFn: authRegister as (data: RegisterSchemaType) => Promise<{ token: string }>,
    onSuccess,
  });
} 