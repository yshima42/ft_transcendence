import { UseMutateAsyncFunction, useMutation } from '@tanstack/react-query';
import { axios } from '../../../lib/axios';

export function usePatchApi<ReqBody, ResBody>(
  endpoint: string
): {
  patchFunc: UseMutateAsyncFunction<ResBody, unknown, ReqBody, unknown>;
  isLoading: boolean;
} {
  const axiosPatch = async (reqBody: ReqBody) => {
    const result = await axios.patch<ResBody>(endpoint, reqBody);

    return result.data;
  };

  const { mutateAsync: patchFunc, isLoading } = useMutation(axiosPatch);

  return { patchFunc, isLoading };
}
