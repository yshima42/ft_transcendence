import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { usePostApi } from '../generics/usePostApi';

export type CreateTwoFactorAuthReqBody = Record<string, never>;

export interface CreateTwoFactorAuthResBody {
  url: string;
}

export type CreateTwoFactorAuth = UseMutateAsyncFunction<
  CreateTwoFactorAuthResBody,
  unknown,
  CreateTwoFactorAuthReqBody,
  unknown
>;

export const useTwoFactorAuthCreate = (): {
  createTwoFactorAuth: CreateTwoFactorAuth;
  isLoading: boolean;
} => {
  const { postFunc: createTwoFactorAuth, isLoading } = usePostApi<
    CreateTwoFactorAuthReqBody,
    CreateTwoFactorAuthResBody
  >('/auth/2fa', [['/auth/2fa'], ['/auth/2fa/state']]);

  return { createTwoFactorAuth, isLoading };
};
