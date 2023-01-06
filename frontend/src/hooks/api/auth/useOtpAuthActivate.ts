import {
  UseMutateAsyncFunction,
  UseMutationResult,
} from '@tanstack/react-query';
import { usePatchApiWithErrorToast } from '../generics/usePatchApi';
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

export const useOtpAuthActivate = (): Omit<
  UseMutationResult<
    ActivateOtpAuthResBody,
    unknown,
    ActivateOtpAuthReqBody,
    unknown
  >,
  'mutateAsync'
> & {
  activateOtpAuth: ActivateOtpAuth;
} => {
  const { mutateAsync: activateOtpAuth, ...useMutationResult } =
    usePatchApiWithErrorToast<ActivateOtpAuthReqBody, ActivateOtpAuthResBody>(
      `/auth/otp/on`,
      [['/auth/otp']]
    );

  return { activateOtpAuth, ...useMutationResult };
};
