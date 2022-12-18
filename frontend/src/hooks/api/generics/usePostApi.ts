import {
  QueryKey,
  UseMutateAsyncFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { axios } from '../../../lib/axios';

// 返り値のpostFunc を使う際は、await すること。
export function usePostApi<ReqBody, ResBody>(
  endpoint: string,
  queryKeys?: QueryKey[]
): {
  postFunc: UseMutateAsyncFunction<ResBody, unknown, ReqBody, unknown>;
  isLoading: boolean;
  isError: boolean;
  failureReason: unknown;
} {
  const axiosPost = async (reqBody: ReqBody) => {
    const result = await axios.post<ResBody>(endpoint, reqBody);

    return result.data;
  };

  const queryClient = useQueryClient();

  const {
    mutateAsync: postFunc,
    isLoading,
    isError,
    failureReason,
  } = useMutation(axiosPost, {
    onSuccess: () => {
      if (queryKeys !== undefined) {
        queryKeys.forEach((queryKey) => {
          void queryClient.invalidateQueries({ queryKey });
        });
      }
    },
  });

  return { postFunc, isLoading, isError, failureReason };
}
