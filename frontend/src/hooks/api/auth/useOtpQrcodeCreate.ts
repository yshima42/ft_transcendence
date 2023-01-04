import { UseMutateAsyncFunction } from '@tanstack/react-query';
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
  } = usePostApi<CreateOtpAuthQrcodeUrlReqBody, CreateOtpAuthQrcodeUrlResBody>(
    '/auth/otp',
    [['/auth/otp']]
  );

  return { createOtpAuthQrcodeUrl, isLoading, isSuccess };
};
