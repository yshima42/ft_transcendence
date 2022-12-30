import { useQuery } from '@tanstack/react-query';
import { axios } from 'lib/axios';

export function useGetApi2<ResBody>(
  endpoint: string
): ReturnType<typeof useQuery> {
  const axiosGet = async (): Promise<ResBody> => {
    const result = await axios.get<ResBody>(endpoint);

    return result.data;
  };

  return useQuery<ResBody>([endpoint], axiosGet, { suspense: true });
}
