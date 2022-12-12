import { useGetApi } from '../generics/useGetApi';

export const useQrcodeUrl = (): { qrcodeUrl: string } => {
  const { data: qrcodeUrl } = useGetApi<{ qrcodeUrl: string }>(`/auth/2fa`);

  return qrcodeUrl;
};
