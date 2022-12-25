import { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
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
  isError: boolean;
  isSuccess: boolean;
} => {
  const {
    patchFunc: activateOtpAuth,
    isLoading,
    isError,
    isSuccess,
    failureReason,
  } = usePatchApi<ActivateOtpAuthReqBody, ActivateOtpAuthResBody>(`/auth/otp`, [
    ['/auth/otp'],
    [`/auth/otp/qrcode-url`],
  ]);

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

  return { activateOtpAuth, isLoading, isError, isSuccess };
};
