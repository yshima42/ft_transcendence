import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { usePostApi } from '../generics/usePostApi';

export type QrCodeUrlReqBody = Record<string, never>;

export interface QrCodeUrlResBody {
  url: string;
}

export type GenerateQrCodeUrl = UseMutateAsyncFunction<
  QrCodeUrlResBody,
  unknown,
  QrCodeUrlReqBody,
  unknown
>;

export const useQrCodeUrl = (): {
  generateQrCodeUrl: GenerateQrCodeUrl;
  isLoading: boolean;
} => {
  const { postFunc: generateQrCodeUrl, isLoading } = usePostApi<
    QrCodeUrlReqBody,
    QrCodeUrlResBody
  >('/auth/2fa/generate');

  return { generateQrCodeUrl, isLoading };
};
