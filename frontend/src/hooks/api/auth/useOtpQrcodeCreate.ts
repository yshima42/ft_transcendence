import {
  UseMutateAsyncFunction,
  UseMutationResult,
} from '@tanstack/react-query';

import { usePostApiWithErrorToast } from '../generics/usePostApi';
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
  const { mutateAsync: createOtpAuthQrcodeUrl, ...useMutationResult } =
    usePostApiWithErrorToast<
      CreateOtpAuthQrcodeUrlReqBody,
      CreateOtpAuthQrcodeUrlResBody
    >('/auth/otp', [['/auth/otp']]);

  return { createOtpAuthQrcodeUrl, ...useMutationResult };
};
