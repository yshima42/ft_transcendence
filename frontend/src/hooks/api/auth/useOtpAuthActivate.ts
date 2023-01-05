import { useEffect } from 'react';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
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

export const useOtpAuthActivate = (): {
  activateOtpAuth: ActivateOtpAuth;
  isLoading: boolean;
  isSuccess: boolean;
} => {
  const {
    mutateAsync: activateOtpAuth,
    isLoading,
    isSuccess,
    isError,
    error,
  } = usePatchApi<ActivateOtpAuthReqBody, ActivateOtpAuthResBody>(
    `/auth/otp/on`,
    [['/auth/otp']]
  );

  const { customToast } = useCustomToast();
  useEffect(() => {
    if (isError && isAxiosError<{ message: string }>(error)) {
      customToast({ description: error.response?.data.message });
    }
  }, [isError, error, customToast]);

  return { activateOtpAuth, isLoading, isSuccess };
};
