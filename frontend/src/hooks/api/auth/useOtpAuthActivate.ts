import {
  UseMutateAsyncFunction,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { usePatchApi } from '../generics/usePatchApi';
import { OneTimePasswordAuthResponse } from './useOtpAuth';

export interface ActivateOtpAuthReqBody {
  oneTimePassword: string;
}

export interface ActivateOtpAuthResBody {
  oneTimePasswordAuthResponse: OneTimePasswordAuthResponse;
}

export type ActivateOtpAuth = UseMutateAsyncFunction<
  ActivateOtpAuthResBody,
  unknown,
  ActivateOtpAuthReqBody,
  unknown
>;

export const useOtpAuthActivate = (): Omit<
  UseMutationResult<
    ActivateOtpAuthResBody,
    unknown,
    ActivateOtpAuthReqBody,
    unknown
  >,
  'mutateAsync'
> & {
  activateOtpAuth: ActivateOtpAuth;
} => {
  const queryClient = useQueryClient();
  const { customToast } = useCustomToast();

  const { mutateAsync: activateOtpAuth, ...useMutationResult } = usePatchApi<
    ActivateOtpAuthReqBody,
    ActivateOtpAuthResBody
  >(`/auth/otp/on`, {
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

  return { activateOtpAuth, ...useMutationResult };
};
