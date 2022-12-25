import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { usePostApi } from '../generics/usePostApi';

export type CreateOtpAuthReqBody = Record<string, never>;

export interface CreateOtpAuthResBody {
  url: string;
}

export type CreateOtpAuth = UseMutateAsyncFunction<
  CreateOtpAuthResBody,
  unknown,
  CreateOtpAuthReqBody,
  unknown
>;

export const useOtpAuthCreate = (): {
  createOtpAuth: CreateOtpAuth;
  isLoading: boolean;
  isSuccess: boolean;
} => {
  const {
    postFunc: createOtpAuth,
    isLoading,
    isSuccess,
  } = usePostApi<CreateOtpAuthReqBody, CreateOtpAuthResBody>('/auth/otp', [
    ['/auth/otp/qrcode-url'],
    ['/auth/otp'],
  ]);

  return { createOtpAuth, isLoading, isSuccess };
};
