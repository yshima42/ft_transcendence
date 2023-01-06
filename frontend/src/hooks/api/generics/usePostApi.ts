import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { axios } from '../../../lib/axios';

export function usePostApi<ReqBody, ResBody>(
  endpoint: string,
  useMutationOptions?: UseMutationOptions<ResBody, unknown, ReqBody, unknown>
): UseMutationResult<ResBody, unknown, ReqBody, unknown> {
  const axiosPost = async (reqBody: ReqBody) => {
    const result = await axios.post<ResBody>(endpoint, reqBody);

    return result.data;
  };

  return useMutation(axiosPost, useMutationOptions);
}
