import { User } from '@prisma/client';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { FileReqBody, usePostFileApi } from '../generics/usePostFileApi';

export interface AvatarUploadResBody {
  user: User;
}

export type UploadAvatar = UseMutateAsyncFunction<
  AvatarUploadResBody,
  unknown,
  FileReqBody,
  unknown
>;

export const useAvatarUpload = (): {
  uploadAvatar: UploadAvatar;
  isLoading: boolean;
} => {
  const { postFunc: uploadAvatar, isLoading } =
    usePostFileApi<AvatarUploadResBody>('/users/me/avatar');

  return { uploadAvatar, isLoading };
};
