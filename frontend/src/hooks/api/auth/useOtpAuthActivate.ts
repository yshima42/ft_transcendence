import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { usePatchApi } from '../generics/usePatchApi';

export interface ActivateOtpAuthReqBody {
  oneTimePassword: string;
}

export interface ActivateOtpAuthResBody {
  message: string;
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
  const { patchFunc: activateOtpAuth, isLoading } = usePatchApi<
    ActivateOtpAuthReqBody,
    ActivateOtpAuthResBody
  >(`/auth/otp`, [['/auth/otp']]);

  return { activateOtpAuth, isLoading };
};
