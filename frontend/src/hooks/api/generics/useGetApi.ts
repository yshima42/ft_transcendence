import { QueryKey, useQuery } from '@tanstack/react-query';
import { axios } from '../../../lib/axios';

// 使う際は、このhooks自体を<Suspense> で囲むこと。
// エラーをキャッチしたい場合は、<ErrorBoundary> で囲むこと。
export function useGetApi<ResBody>(
  endpoint: string,
  queryKey?: QueryKey
): {
  data: ResBody;
} {
  const axiosGet = async (): Promise<ResBody> => {
    const result = await axios.get<ResBody>(endpoint);

    return result.data;
  };

  const tmp = queryKey === undefined ? [endpoint] : [...queryKey];

  const { data } = useQuery<ResBody>(tmp, axiosGet);

  // TODO: エラーの場合、useQuery内で例外が投げられるので、いつ入るかわかってない。
  if (data === undefined) {
    throw new Error('Error in userProfile');
  }

  return { data };
}
