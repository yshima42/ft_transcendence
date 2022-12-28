import { OneTimePasswordAuth } from '@prisma/client';
import { useGetApi } from '../generics/useGetApi';

export type OneTimePasswordAuthResponse = Omit<OneTimePasswordAuth, 'secret'>;

export const useOtpAuth = (): OneTimePasswordAuthResponse => {
  const { data: oneTimePasswordAuthResponse } =
    useGetApi<OneTimePasswordAuthResponse>(`/auth/otp`);

  return oneTimePasswordAuthResponse;
};
