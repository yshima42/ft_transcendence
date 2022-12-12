import {
  QueryKey,
  UseMutateAsyncFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { axios } from '../../../lib/axios';

export function usePatchApi<ReqBody, ResBody>(
  endpoint: string,
  queryKeys?: QueryKey[]
): {
  patchFunc: UseMutateAsyncFunction<ResBody, unknown, ReqBody, unknown>;
  isLoading: boolean;
} {
  const axiosPatch = async (reqBody: ReqBody) => {
    const result = await axios.patch<ResBody>(endpoint, reqBody);

    return result.data;
  };

  const queryClient = useQueryClient();

  const { mutateAsync: patchFunc, isLoading } = useMutation(axiosPatch, {
    onSuccess: () => {
      if (queryKeys !== undefined) {
        queryKeys.forEach((queryKey) => {
          void queryClient.invalidateQueries([queryKey]);
        });
      }
    },
  });

  return { patchFunc, isLoading };
}
