import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { axios } from '../../../lib/axios';

export function useDeleteApi<ResBody>(
  endpoint: string,
  queryKeys?: QueryKey[],
  useMutationOptions?: UseMutationOptions<ResBody, unknown, void, unknown>
): UseMutationResult<ResBody, unknown, void, unknown> {
  const axiosDelete = async () => {
    const result = await axios.delete<ResBody>(endpoint);

    return result.data;
  };

  const queryClient = useQueryClient();

  const useMutationResult = useMutation(axiosDelete, {
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
