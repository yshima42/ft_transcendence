import * as ReactQuery from '@tanstack/react-query';
import { axios } from 'lib/axios';

export function useDeleteApiReset<ResBody>(
  endpoint: string,
  queryKeys?: ReactQuery.QueryKey[]
): ReturnType<typeof ReactQuery.useMutation> {
  const axiosDelete = async () => {
    const result = await axios.delete<ResBody>(endpoint);

    return result.data;
  };

  const queryClient = ReactQuery.useQueryClient();

  return ReactQuery.useMutation(axiosDelete, {
    onSuccess: () => {
      if (queryKeys !== undefined) {
        queryKeys.forEach((queryKey) => {
          void queryClient.resetQueries({ queryKey });
        });
      }
    },
  });
}
