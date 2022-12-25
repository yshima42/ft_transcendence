import { useGetApi } from '../generics/useGetApi';

export const useIsOtpAuthEnabled = (): { isOtpAuthEnabled: boolean | null } => {
  const {
    data: { isOtpAuthEnabled },
  } = useGetApi<{
    isOtpAuthEnabled: boolean | null;
  }>(`/auth/otp`);

  return { isOtpAuthEnabled };
};
