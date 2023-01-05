import { useEffect } from 'react';
import { User } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { usePostFileApi } from '../generics/usePostFileApi';

export interface AvatarFormData {
  file: File;
}

export interface AvatarUploadResBody {
  user: User;
}

export type UploadAvatar = UseMutateAsyncFunction<
  AvatarUploadResBody,
  unknown,
  AvatarFormData,
  unknown
>;

export const useAvatarUpload = (): {
  uploadAvatar: UploadAvatar;
  isLoading: boolean;
  isSuccess: boolean;
} => {
  const {
    mutateAsync: uploadAvatar,
    isLoading,
    isSuccess,
    isError,
    error,
  } = usePostFileApi<AvatarUploadResBody>('/users/me/avatar', [
    ['/users/me/profile'],
    ['/game/matches'],
  ]);

  const { customToast } = useCustomToast();
  useEffect(() => {
    if (isError && isAxiosError<{ message: string }>(error)) {
      customToast({ description: error.response?.data.message });
    }
  }, [isError, error, customToast]);

  return { uploadAvatar, isLoading, isSuccess };
};
