import { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { usePatchApi } from '../generics/usePatchApi';
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
  } = usePatchApi<ActivateOtpAuthReqBody, ActivateOtpAuthResBody>(
    `/auth/otp/on`,
    [['/auth/otp']]
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

  return { activateOtpAuth, isLoading, isError, isSuccess };
};
