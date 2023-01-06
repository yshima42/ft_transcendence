import {
  useMutation,
  UseMutationResult,
  UseMutationOptions,
} from '@tanstack/react-query';
import { axios } from '../../../lib/axios';

export function usePatchApi<ReqBody, ResBody>(
  endpoint: string,
  useMutationOptions?: UseMutationOptions<ResBody, unknown, ReqBody, unknown>
): UseMutationResult<ResBody, unknown, ReqBody, unknown> {
  const axiosPatch = async (reqBody: ReqBody) => {
    const result = await axios.patch<ResBody>(endpoint, reqBody);

    return result.data;
  };

  return useMutation(axiosPatch, useMutationOptions);
}
