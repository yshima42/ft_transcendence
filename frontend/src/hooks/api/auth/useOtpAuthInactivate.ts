import {
  UseMutateAsyncFunction,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { usePatchApi } from '../generics/usePatchApi';
import { OneTimePasswordAuthResponse } from './useOtpAuth';

export type InactivateOtpAuthReqBody = Record<string, never>;

export interface InactivateOtpAuthResBody {
  oneTimePasswordAuthResponse: OneTimePasswordAuthResponse;
}

export type InactivateOtpAuth = UseMutateAsyncFunction<
  InactivateOtpAuthResBody,
  unknown,
  InactivateOtpAuthReqBody,
  unknown
>;

export const useOtpAuthInactivate = (): Omit<
  UseMutationResult<
    InactivateOtpAuthResBody,
    unknown,
    InactivateOtpAuthReqBody,
    unknown
  >,
  'mutateAsync'
> & {
  inactivateOtpAuth: InactivateOtpAuth;
} => {
  const queryClient = useQueryClient();
  const { customToast } = useCustomToast();

  const { mutateAsync: inactivateOtpAuth, ...useMutationResult } = usePatchApi<
    InactivateOtpAuthReqBody,
    InactivateOtpAuthResBody
  >(`/auth/otp/off`, {
    onSuccess: () => {
      const queryKeys = [['/auth/otp']];
      queryKeys.forEach((queryKey) => {
        void queryClient.invalidateQueries({ queryKey });
      });
    },
    onError: (error) => {
      if (isAxiosError<{ message: string }>(error)) {
        customToast({ description: error.response?.data.message });
      }
    },
  });

  return { inactivateOtpAuth, ...useMutationResult };
};
