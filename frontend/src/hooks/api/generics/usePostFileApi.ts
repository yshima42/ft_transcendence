import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { axios } from '../../../lib/axios';

export interface FileReqBody {
  file: File;
}

export function usePostFileApi<ResBody>(
  endpoint: string,
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

  return useMutation(axiosPost, useMutationOptions);
}
