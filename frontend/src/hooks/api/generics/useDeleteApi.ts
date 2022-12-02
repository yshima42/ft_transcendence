import { UseMutateAsyncFunction, useMutation } from '@tanstack/react-query';
import { axios } from '../../../lib/axios';

export function useDeleteApi<ResBody>(endpoint: string): {
  deleteFunc: UseMutateAsyncFunction<ResBody, unknown, void, unknown>;
  isLoading: boolean;
} {
  const axiosDelete = async () => {
    const result = await axios.delete<ResBody>(endpoint);

    return result.data;
  };

  const { mutateAsync: deleteFunc, isLoading } = useMutation(axiosDelete);

  return { deleteFunc, isLoading };
}
