import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { usePostApi } from '../generics/usePostApi';

export interface ValidateOtpAuthReqBody {
  oneTimePassword: string;
}

export interface ValidateOtpAuthResBody {
  isCodeValid: boolean;
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
    postFunc: validateOtpAuth,
    isLoading,
    isSuccess,
  } = usePostApi<ValidateOtpAuthReqBody, ValidateOtpAuthResBody>(
    '/auth/otp/validation'
  );

  return { validateOtpAuth, isLoading, isSuccess };
};
