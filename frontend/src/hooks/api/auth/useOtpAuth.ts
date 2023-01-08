import { OneTimePasswordAuth } from '@prisma/client';
import { useGetApiOmitUndefined } from '../generics/useGetApi';

export type OneTimePasswordAuthResponse = Omit<OneTimePasswordAuth, 'secret'>;

export const useOtpAuth = (): OneTimePasswordAuthResponse => {
  const { data: oneTimePasswordAuthResponse } =
    useGetApiOmitUndefined<OneTimePasswordAuthResponse>(`/auth/otp`);

  return oneTimePasswordAuthResponse;
};
