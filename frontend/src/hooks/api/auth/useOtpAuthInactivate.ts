import { useEffect } from 'react';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
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

export const useOtpAuthInactivate = (): {
  inactivateOtpAuth: InactivateOtpAuth;
  isLoading: boolean;
  isSuccess: boolean;
} => {
  const {
    mutateAsync: inactivateOtpAuth,
    isLoading,
    isSuccess,
    isError,
    error,
  } = usePatchApi<InactivateOtpAuthReqBody, InactivateOtpAuthResBody>(
    `/auth/otp/off`,
    [['/auth/otp']]
  );

  const { customToast } = useCustomToast();
  useEffect(() => {
    if (isError && isAxiosError<{ message: string }>(error)) {
      customToast({ description: error.response?.data.message });
    }
  }, [isError, error, customToast]);

  return { inactivateOtpAuth, isLoading, isSuccess };
};
