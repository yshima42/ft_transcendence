import { UseMutateAsyncFunction, useMutation } from '@tanstack/react-query';
import { axios } from '../../../lib/axios';

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
