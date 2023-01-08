import {
  useMutation,
  UseMutationResult,
  UseMutationOptions,
  QueryKey,
  useQueryClient,
} from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { axios } from '../../../lib/axios';

export function usePatchApi<ReqBody, ResBody>(
  endpoint: string,
  invalidQueryKeys?: QueryKey[],
  useMutationOptions?: UseMutationOptions<ResBody, unknown, ReqBody, unknown>
): UseMutationResult<ResBody, unknown, ReqBody, unknown> {
  const axiosPatch = async (reqBody: ReqBody) => {
    const result = await axios.patch<ResBody>(endpoint, reqBody);

    return result.data;
  };

  const queryClient = useQueryClient();

  return useMutation(axiosPatch, {
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

export function usePatchApiWithErrorToast<ReqBody, ResBody>(
  endpoint: string,
  invalidQueryKeys?: QueryKey[],
  useMutationOptions?: UseMutationOptions<ResBody, unknown, ReqBody, unknown>
): UseMutationResult<ResBody, unknown, ReqBody, unknown> {
  const { customToast } = useCustomToast();

  return usePatchApi(endpoint, invalidQueryKeys, {
    onError: (error) => {
      if (isAxiosError<{ message: string }>(error)) {
        customToast({ description: error.response?.data.message });
      }
    },
    ...useMutationOptions,
  });
}
