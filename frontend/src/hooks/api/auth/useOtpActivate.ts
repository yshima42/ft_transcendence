import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { usePostApi } from '../generics/usePostApi';

export type ActivateOtpAuthReqBody = Record<string, never>;

export interface ActivateOtpAuthResBody {
  url: string;
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
} => {
  const { postFunc: activateOtpAuth, isLoading } = usePostApi<
    ActivateOtpAuthReqBody,
    ActivateOtpAuthResBody
  >('/auth/otp/activation', [['/auth/otp']]);

  return { activateOtpAuth, isLoading };
};
