import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { axios } from '../../../lib/axios';

export function useDeleteApi<ResBody>(
  endpoint: string,
  useMutationOptions?: UseMutationOptions<ResBody, unknown, void, unknown>
): UseMutationResult<ResBody, unknown, void, unknown> {
  const axiosDelete = async () => {
    const result = await axios.delete<ResBody>(endpoint);

    return result.data;
  };

  return useMutation(axiosDelete, useMutationOptions);
}
