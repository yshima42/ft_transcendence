import { UseMutateAsyncFunction, useMutation } from '@tanstack/react-query';
import { axios } from '../../../lib/axios';

// 返り値のpostFunc を使う際は、await すること。
export function usePostApi<ReqBody, ResBody>(
  endpoint: string
): {
  postFunc: UseMutateAsyncFunction<ResBody, unknown, ReqBody, unknown>;
  isLoading: boolean;
} {
  const axiosPost = async (reqBody: ReqBody) => {
    const result = await axios.post<ResBody>(endpoint, reqBody);

    return result.data;
  };

  const { mutateAsync: postFunc, isLoading } = useMutation(axiosPost);

  return { postFunc, isLoading };
}
