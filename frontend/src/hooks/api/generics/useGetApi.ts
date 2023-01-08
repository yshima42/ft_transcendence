import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { axios } from 'lib/axios';

// 使う際は、このhooks自体を<Suspense> で囲むこと。
// エラーをキャッチしたい場合は、<ErrorBoundary> で囲むこと。
export function useGetApi<ResBody>(
  endpoint: string,
  useQueryOptions?: UseQueryOptions<ResBody, unknown>
): UseQueryResult<ResBody, unknown> {
  const axiosGet = async (): Promise<ResBody> => {
    const result = await axios.get<ResBody>(endpoint);

    return result.data;
  };

  return useQuery<ResBody>([endpoint], axiosGet, useQueryOptions);
}

// data がundefined になることを想定しない場合、使う。
export function useGetApiOmitUndefined<ResBody>(
  endpoint: string,
  useQueryOptions?: UseQueryOptions<ResBody, unknown>
): Omit<UseQueryResult<ResBody, unknown>, 'data'> & { data: ResBody } {
  const { data, ...useQueryResult } = useGetApi<ResBody>(
    endpoint,
    useQueryOptions
  );

  // option enabled をfalse にした場合などに、data がundefined になる。
  if (data === undefined) {
    throw new Error('Error in useGetApiOmitUndefined');
  }

  return { data, ...useQueryResult };
}
