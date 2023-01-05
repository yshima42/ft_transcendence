import { useEffect } from 'react';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { usePostApi } from '../generics/usePostApi';
import { OneTimePasswordAuthResponse } from './useOtpAuth';

export type CreateOtpAuthQrcodeUrlReqBody = Record<string, never>;

export interface CreateOtpAuthQrcodeUrlResBody {
  oneTimePasswordAuthResponse: OneTimePasswordAuthResponse;
}

export type CreateOtpAuthQrcodeUrl = UseMutateAsyncFunction<
  CreateOtpAuthQrcodeUrlResBody,
  unknown,
  CreateOtpAuthQrcodeUrlReqBody,
  unknown
>;

export const useOtpAuthQrcodeCreate = (): {
  createOtpAuthQrcodeUrl: CreateOtpAuthQrcodeUrl;
  isLoading: boolean;
  isSuccess: boolean;
} => {
  const {
    mutateAsync: createOtpAuthQrcodeUrl,
    isLoading,
    isSuccess,
    isError,
    error,
  } = usePostApi<CreateOtpAuthQrcodeUrlReqBody, CreateOtpAuthQrcodeUrlResBody>(
    '/auth/otp',
    [['/auth/otp']]
  );

  const { customToast } = useCustomToast();
  useEffect(() => {
    if (isError && isAxiosError<{ message: string }>(error)) {
      customToast({ description: error.response?.data.message });
    }
  }, [isError, error, customToast]);

  return { createOtpAuthQrcodeUrl, isLoading, isSuccess };
};
