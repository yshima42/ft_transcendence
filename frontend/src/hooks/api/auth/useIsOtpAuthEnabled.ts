import { useGetApi } from '../generics/useGetApi';

export const useIsOtpAuthEnabled = (): { isOtpAuthEnabled: boolean } => {
  const { data: isOtpAuthEnabled } = useGetApi<boolean>(`/auth/otp`);

  return { isOtpAuthEnabled };
};
