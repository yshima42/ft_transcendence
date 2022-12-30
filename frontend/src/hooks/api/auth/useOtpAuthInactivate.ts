import { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { usePatchApi } from '../generics/usePatchApi';
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

export const useOtpAuthInactivate = (): {
  inactivateOtpAuth: InactivateOtpAuth;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
} => {
  const {
    patchFunc: inactivateOtpAuth,
    isLoading,
    isError,
    isSuccess,
    failureReason,
  } = usePatchApi<InactivateOtpAuthReqBody, InactivateOtpAuthResBody>(
    `/auth/otp/off`,
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

  return { inactivateOtpAuth, isLoading, isError, isSuccess };
};
