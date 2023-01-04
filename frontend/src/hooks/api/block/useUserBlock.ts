import { useEffect } from 'react';
import { Block } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { usePostApi } from '../generics/usePostApi';

export interface UserBlockReqBody {
  targetId: string;
}

export interface UserBlockResBody {
  block: Block;
}

export type BlockUser = UseMutateAsyncFunction<
  UserBlockResBody,
  unknown,
  UserBlockReqBody,
  unknown
>;

export const useUserBlock = (
  targetId: string
): {
  blockUser: BlockUser;
  isLoading: boolean;
  isSuccess: boolean;
} => {
  const {
    mutateAsync: blockUser,
    isLoading,
    isSuccess,
    isError,
    error,
  } = usePostApi<UserBlockReqBody, UserBlockResBody>(`/users/me/blocks`, [
    ['/users/me/blocks'],
    [`/users/me/block-relations/${targetId}`],
  ]);

  const { customToast } = useCustomToast();
  useEffect(() => {
    if (isError && isAxiosError<{ message: string }>(error)) {
      customToast({ description: error.response?.data.message });
    }
  }, [isError, error, customToast]);

  return { blockUser, isLoading, isSuccess };
};
