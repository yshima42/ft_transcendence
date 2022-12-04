import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from '@tanstack/react-query';
import { useGetApi } from '../generics/useGetApi';

export const useQrCodeUrl = (): {
  url: string;
  refetchQrCodeUrl: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<{ url: string }, unknown>>;
} => {
  const { data, refetch } = useGetApi<{ url: string }>('/auth/2fa/generate');

  return { url: data.url, refetchQrCodeUrl: refetch };
};
