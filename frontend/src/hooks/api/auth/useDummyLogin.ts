import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { usePostApi } from '../generics/usePostApi';

export interface DummyLoginReqBody {
  name: string;
}

export interface DummyLoginResBody {
  message: string;
}

export type DummyLogin = UseMutateAsyncFunction<
  DummyLoginResBody,
  unknown,
  DummyLoginReqBody,
  unknown
>;

export const useDummyLogin = (): {
  dummyLogin: DummyLogin;
  isLoading: boolean;
} => {
  const { postFunc: dummyLogin, isLoading } = usePostApi<
    DummyLoginReqBody,
    DummyLoginResBody
  >('/auth/login/dummy');

  return { dummyLogin, isLoading };
};
