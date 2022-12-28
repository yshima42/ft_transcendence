import { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
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

export const useOtpAuthValidate = (): {
  validateOtpAuth: ValidateOtpAuth;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
} => {
  const {
    postFunc: validateOtpAuth,
    isLoading,
    isError,
    isSuccess,
    failureReason,
  } = usePostApi<ValidateOtpAuthReqBody, ValidateOtpAuthResBody>(
    '/auth/otp/validation'
  );

  const toast = useToast();
  useEffect(() => {
    if (isError && isAxiosError<{ message: string }>(failureReason)) {
      toast({
        title: 'Error',
        description: failureReason.response?.data.message,
        status: 'error',
        position: 'top',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [isError, toast, failureReason]);

  return { validateOtpAuth, isLoading, isError, isSuccess };
};
