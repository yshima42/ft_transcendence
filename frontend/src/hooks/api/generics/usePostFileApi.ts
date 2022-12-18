import {
  QueryKey,
  UseMutateAsyncFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { axios } from '../../../lib/axios';

export interface FileReqBody {
  file: File;
}

export function usePostFileApi<ResBody>(
  endpoint: string,
  queryKeys?: QueryKey[]
): {
  postFunc: UseMutateAsyncFunction<ResBody, unknown, FileReqBody, unknown>;
  isLoading: boolean;
  isError: boolean;
  failureReason: unknown;
} {
  const axiosPost = async (reqBody: FileReqBody) => {
    const formData = new FormData();
    formData.append('file', reqBody.file);

    const result = await axios.post<ResBody>(endpoint, formData);

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
