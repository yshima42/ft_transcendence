import { User } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
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
    postFunc: uploadAvatar,
    isLoading,
    isSuccess,
  } = usePostFileApi<AvatarUploadResBody>('/users/me/avatar', [
    ['/users/me/profile'],
    ['/game/matches'],
  ]);

  return { uploadAvatar, isLoading, isSuccess };
};
