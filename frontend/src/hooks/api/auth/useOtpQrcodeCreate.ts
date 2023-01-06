import {
  UseMutateAsyncFunction,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { usePostApi } from '../generics/usePostApi';
import { OneTimePasswordAuthResponse } from './useOtpAuth';

export type CreateOtpAuthQrcodeUrlReqBody = Record<string, never>;

export interface CreateOtpAuthQrcodeUrlResBody {
  oneTimePasswordAuthResponse: OneTimePasswordAuthResponse;
}

export type CreateOtpAuthQrcodeUrl = UseMutateAsyncFunction<
  CreateOtpAuthQrcodeUrlResBody,
  unknown,
  CreateOtpAuthQrcodeUrlReqBody,
  unknown
>;

export const useOtpAuthQrcodeCreate = (): Omit<
  UseMutationResult<
    CreateOtpAuthQrcodeUrlResBody,
    unknown,
    CreateOtpAuthQrcodeUrlReqBody,
    unknown
  >,
  'mutateAsync'
> & {
  createOtpAuthQrcodeUrl: CreateOtpAuthQrcodeUrl;
} => {
  const queryClient = useQueryClient();
  const { customToast } = useCustomToast();

  const { mutateAsync: createOtpAuthQrcodeUrl, ...useMutationResult } =
    usePostApi<CreateOtpAuthQrcodeUrlReqBody, CreateOtpAuthQrcodeUrlResBody>(
      '/auth/otp',
      {
        onSuccess: () => {
          const queryKeys = [['/auth/otp']];
          queryKeys.forEach((queryKey) => {
            void queryClient.invalidateQueries({ queryKey });
          });
        },
        onError: (error) => {
          if (isAxiosError<{ message: string }>(error)) {
            customToast({ description: error.response?.data.message });
          }
        },
      }
    );

  return { createOtpAuthQrcodeUrl, ...useMutationResult };
};
