import { useGetApi } from '../generics/useGetApi';

export const useGetTwoFactorAuthState = (): { twoFactorAuthState: boolean } => {
  const { data: twoFactorAuthState } = useGetApi<boolean>(`/auth/2fa`);

  return { twoFactorAuthState };
};
