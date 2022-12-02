import { useQuery } from '@tanstack/react-query';
import { axios } from '../../../lib/axios';

// 使う際は、このhooks自体を<Suspense> で囲むこと。
// エラーをキャッチしたい場合は、<ErrorBoundary> で囲むこと。
export function useGetApi<ResBody>(endpoint: string): {
  data: ResBody;
} {
  const axiosGet = async (): Promise<ResBody> => {
    const result = await axios.get<ResBody>(endpoint);

    return result.data;
  };
  const { data } = useQuery<ResBody>([endpoint], axiosGet);

  // TODO: エラーの場合、useQuery内で例外が投げられるので、いつ入るかわかってない。
  if (data === undefined) {
    throw new Error('Error in userProfile');
  }

  return { data };
}
