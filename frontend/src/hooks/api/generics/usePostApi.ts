import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { axios } from '../../../lib/axios';

export function usePostApi<ReqBody, ResBody>(
  endpoint: string,
  invalidQueryKeys?: QueryKey[],
  useMutationOptions?: UseMutationOptions<ResBody, unknown, ReqBody, unknown>
): UseMutationResult<ResBody, unknown, ReqBody, unknown> {
  const axiosPost = async (reqBody: ReqBody) => {
    const result = await axios.post<ResBody>(endpoint, reqBody);

    return result.data;
  };

  const queryClient = useQueryClient();

  return useMutation(axiosPost, {
    onSuccess: () => {
      if (invalidQueryKeys !== undefined) {
        invalidQueryKeys.forEach((queryKey) => {
          void queryClient.invalidateQueries({ queryKey });
        });
      }
    },
    ...useMutationOptions,
  });
}

export function usePostApiWithErrorToast<ReqBody, ResBody>(
  endpoint: string,
  invalidQueryKeys?: QueryKey[],
  useMutationOptions?: UseMutationOptions<ResBody, unknown, ReqBody, unknown>
): UseMutationResult<ResBody, unknown, ReqBody, unknown> {
  const { customToast } = useCustomToast();

  return usePostApi(endpoint, invalidQueryKeys, {
    onError: (error) => {
      if (isAxiosError<{ message: string }>(error)) {
        customToast({ description: error.response?.data.message });
      }
    },
    ...useMutationOptions,
  });
}
