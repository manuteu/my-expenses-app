import { useMutation } from '@tanstack/react-query';
// import { handleApiError } from '@/core/handlers/handle-api-error';
import { authLogin } from '../services';
import type { ILoginResponse } from '../types';

export function useLoginMutation(onSuccess?: (data: ILoginResponse) => void) {
  return useMutation({
    mutationFn: authLogin,
    onSuccess,
    // onError: (error) => {
    //   handleApiError(error);
    // },
  });
}
