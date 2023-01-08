import {
  UseMutateAsyncFunction,
  UseMutationResult,
} from '@tanstack/react-query';
import { usePostApiWithErrorToast } from '../generics/usePostApi';

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

export const useOtpAuthValidate = (): Omit<
  UseMutationResult<
    ValidateOtpAuthResBody,
    unknown,
    ValidateOtpAuthReqBody,
    unknown
  >,
  'mutateAsync'
> & {
  validateOtpAuth: ValidateOtpAuth;
} => {
  const { mutateAsync: validateOtpAuth, ...useMutationResult } =
    usePostApiWithErrorToast<ValidateOtpAuthReqBody, ValidateOtpAuthResBody>(
      '/auth/otp/validation'
    );

  return { validateOtpAuth, ...useMutationResult };
};
