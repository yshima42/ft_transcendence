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

export interface FileReqBody {
  file: File;
}

export function usePostFileApi<ResBody>(
  endpoint: string,
  invalidQueryKeys?: QueryKey[],
  useMutationOptions?: UseMutationOptions<
    ResBody,
    unknown,
    FileReqBody,
    unknown
  >
): UseMutationResult<ResBody, unknown, FileReqBody, unknown> {
  const axiosPost = async (reqBody: FileReqBody) => {
    const formData = new FormData();
    formData.append('file', reqBody.file);

    const result = await axios.post<ResBody>(endpoint, formData);

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

export function usePostFileApiWithErrorToast<ResBody>(
  endpoint: string,
  invalidQueryKeys?: QueryKey[],
  useMutationOptions?: UseMutationOptions<
    ResBody,
    unknown,
    FileReqBody,
    unknown
  >
): UseMutationResult<ResBody, unknown, FileReqBody, unknown> {
  const { customToast } = useCustomToast();

  return usePostFileApi(endpoint, invalidQueryKeys, {
    onError: (error) => {
      if (isAxiosError<{ message: string }>(error)) {
        customToast({ description: error.response?.data.message });
      }
    },
    ...useMutationOptions,
  });
}
