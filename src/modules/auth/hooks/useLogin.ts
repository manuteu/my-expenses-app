import { useMutation } from '@tanstack/react-query';
// import { handleApiError } from '@/core/handlers/handle-api-error';
import { authLogin } from '../services';
import type { ILoginResponse } from '../types';
import type { LoginSchemaType } from '../components/auth-form';

export function useLoginMutation(onSuccess?: (data: ILoginResponse) => void) {
  return useMutation({
    mutationFn: authLogin as (data: LoginSchemaType) => Promise<ILoginResponse>,
    onSuccess,
    // onError: (error) => {
    //   handleApiError(error);
    // },
  });
}
