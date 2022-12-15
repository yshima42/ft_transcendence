import { useGetApi } from '../generics/useGetApi';

export const useOtpQrcodeUrl = (): { qrcodeUrl: string } => {
  const { data: qrcodeUrl } = useGetApi<{ qrcodeUrl: string }>(
    `/auth/otp/qrcode-url`
  );

  return qrcodeUrl;
};
