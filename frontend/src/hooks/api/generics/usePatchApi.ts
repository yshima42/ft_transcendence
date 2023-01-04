import {
  QueryKey,
  useMutation,
  UseMutationResult,
  useQueryClient,
  UseMutationOptions,
} from '@tanstack/react-query';
import { axios } from '../../../lib/axios';

export function usePatchApi<ReqBody, ResBody>(
  endpoint: string,
  queryKeys?: QueryKey[],
  useMutationOptions?: UseMutationOptions<ResBody, unknown, ReqBody, unknown>
): UseMutationResult<ResBody, unknown, ReqBody, unknown> {
  const axiosPatch = async (reqBody: ReqBody) => {
    const result = await axios.patch<ResBody>(endpoint, reqBody);

    return result.data;
  };

  const queryClient = useQueryClient();

  const useMutationResult = useMutation(axiosPatch, {
    onSuccess: () => {
      if (queryKeys !== undefined) {
        queryKeys.forEach((queryKey) => {
          void queryClient.invalidateQueries({ queryKey });
        });
      }
    },
    ...useMutationOptions,
  });

  return useMutationResult;
}
