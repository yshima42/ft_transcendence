import { useEffect } from 'react';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { usePostApi } from '../generics/usePostApi';

export interface ValidateOtpAuthReqBody {
  oneTimePassword: string;
}

export interface ValidateOtpAuthResBody {
  message: string;
}

export type ValidateOtpAuth = UseMutateAsyncFunction<
  ValidateOtpAuthResBody,
  unknown,
  ValidateOtpAuthReqBody,
  unknown
>;

export const useOtpAuthValidate = (): {
  validateOtpAuth: ValidateOtpAuth;
  isLoading: boolean;
  isSuccess: boolean;
} => {
  const {
    mutateAsync: validateOtpAuth,
    isLoading,
    isSuccess,
    isError,
    error,
  } = usePostApi<ValidateOtpAuthReqBody, ValidateOtpAuthResBody>(
    '/auth/otp/validation'
  );

  const { customToast } = useCustomToast();
  useEffect(() => {
    if (isError && isAxiosError<{ message: string }>(error)) {
      customToast({ description: error.response?.data.message });
    }
  }, [isError, error, customToast]);

  return { validateOtpAuth, isLoading, isSuccess };
};
