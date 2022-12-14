import {
  QueryKey,
  UseMutateAsyncFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { axios } from '../../../lib/axios';

export function useDeleteApi<ResBody>(
  endpoint: string,
  queryKeys?: QueryKey[]
): {
  deleteFunc: UseMutateAsyncFunction<ResBody, unknown, void, unknown>;
  isLoading: boolean;
} {
  const axiosDelete = async () => {
    const result = await axios.delete<ResBody>(endpoint);

    return result.data;
  };

  const queryClient = useQueryClient();

  const { mutateAsync: deleteFunc, isLoading } = useMutation(axiosDelete, {
    onSuccess: () => {
      if (queryKeys !== undefined) {
        queryKeys.forEach((queryKey) => {
          void queryClient.invalidateQueries(queryKey);
        });
      }
    },
  });

  return { deleteFunc, isLoading };
}
