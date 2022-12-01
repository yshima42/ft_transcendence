import { UseMutateAsyncFunction, useMutation } from '@tanstack/react-query';
import { axios } from '../../../lib/axios';

export interface FileReqBody {
  file: File;
}

export function usePostFileApi<ResBody>(endpoint: string): {
  postFunc: UseMutateAsyncFunction<ResBody, unknown, FileReqBody, unknown>;
  isLoading: boolean;
} {
  const axiosPost = async (reqBody: FileReqBody) => {
    const formData = new FormData();
    formData.append('file', reqBody.file);

    const result = await axios.post<ResBody>(endpoint, formData);

    return result.data;
  };

  const { mutateAsync: postFunc, isLoading } = useMutation(axiosPost);

  return { postFunc, isLoading };
}
