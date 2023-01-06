import { OneTimePasswordAuth } from '@prisma/client';
import { useCustomGetApi } from '../generics/useGetApi';

export type OneTimePasswordAuthResponse = Omit<OneTimePasswordAuth, 'secret'>;

export const useOtpAuth = (): OneTimePasswordAuthResponse => {
  const { data: oneTimePasswordAuthResponse } =
    useCustomGetApi<OneTimePasswordAuthResponse>(`/auth/otp`);

  return oneTimePasswordAuthResponse;
};
