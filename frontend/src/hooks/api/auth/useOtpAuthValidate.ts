import {
  UseMutateAsyncFunction,
  UseMutationResult,
} from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { usePostApi } from '../generics/usePostApi';

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
  const { customToast } = useCustomToast();

  const { mutateAsync: validateOtpAuth, ...useMutationResult } = usePostApi<
    ValidateOtpAuthReqBody,
    ValidateOtpAuthResBody
  >('/auth/otp/validation', {
    onError: (error) => {
      if (isAxiosError<{ message: string }>(error)) {
        customToast({ description: error.response?.data.message });
      }
    },
  });

  return { validateOtpAuth, ...useMutationResult };
};
