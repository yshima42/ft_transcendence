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

export function useDeleteApi<ResBody>(
  endpoint: string,
  invalidQueryKeys?: QueryKey[],
  useMutationOptions?: UseMutationOptions<ResBody, unknown, void, unknown>
): UseMutationResult<ResBody, unknown, void, unknown> {
  const axiosDelete = async () => {
    const result = await axios.delete<ResBody>(endpoint);

    return result.data;
  };

  const queryClient = useQueryClient();

  return useMutation(axiosDelete, {
    onSuccess: () => {
      if (invalidQueryKeys !== undefined) {
        invalidQueryKeys.forEach((queryKey) => {
          void queryClient.resetQueries({ queryKey });
        });
      }
    },
    ...useMutationOptions,
  });
}
export function useDeleteApiWithErrorToast<ResBody>(
  endpoint: string,
  invalidQueryKeys?: QueryKey[],
  useMutationOptions?: UseMutationOptions<ResBody, unknown, void, unknown>
): UseMutationResult<ResBody, unknown, void, unknown> {
  const { customToast } = useCustomToast();

  return useDeleteApi(endpoint, invalidQueryKeys, {
    onError: (error) => {
      if (isAxiosError<{ message: string }>(error)) {
        customToast({ description: error.response?.data.message });
      }
    },
    ...useMutationOptions,
  });
}
