import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useQuery,
} from '@tanstack/react-query';
import { axios } from '../../../lib/axios';

// 使う際は、このhooks自体を<Suspense> で囲むこと。
// エラーをキャッチしたい場合は、<ErrorBoundary> で囲むこと。
export function useGetApi<ResBody>(
  endpoint: string,
  options?: { enabled?: boolean; refetchOnWindowFocus?: boolean }
): {
  data: ResBody;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<ResBody, unknown>>;
} {
  const axiosGet = async (): Promise<ResBody> => {
    const result = await axios.get<ResBody>(endpoint);

    return result.data;
  };
  const { data, refetch } = useQuery<ResBody>([endpoint], axiosGet, options);

  // TODO: エラーの場合、useQuery内で例外が投げられるので、いつ入るかわかってない。
  if (data === undefined) {
    throw new Error('Error in userProfile');
  }

  return { data, refetch };
}
