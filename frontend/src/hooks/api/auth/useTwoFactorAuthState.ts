import { useGetApi } from '../generics/useGetApi';

export const useTwoFactorAuthState = (): { twoFactorAuthState: boolean } => {
  const { data: twoFactorAuthState } = useGetApi<boolean>(`/auth/2fa/state`);

  return { twoFactorAuthState };
};
