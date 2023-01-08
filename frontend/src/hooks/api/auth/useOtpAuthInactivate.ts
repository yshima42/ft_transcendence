import {
  UseMutateAsyncFunction,
  UseMutationResult,
} from '@tanstack/react-query';
import { usePatchApiWithErrorToast } from '../generics/usePatchApi';
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

export const useOtpAuthInactivate = (): Omit<
  UseMutationResult<
    InactivateOtpAuthResBody,
    unknown,
    InactivateOtpAuthReqBody,
    unknown
  >,
  'mutateAsync'
> & {
  inactivateOtpAuth: InactivateOtpAuth;
} => {
  const { mutateAsync: inactivateOtpAuth, ...useMutationResult } =
    usePatchApiWithErrorToast<
      InactivateOtpAuthReqBody,
      InactivateOtpAuthResBody
    >(`/auth/otp/off`, [['/auth/otp']]);

  return { inactivateOtpAuth, ...useMutationResult };
};
