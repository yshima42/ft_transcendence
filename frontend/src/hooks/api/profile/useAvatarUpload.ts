import { User } from '@prisma/client';
import {
  UseMutateAsyncFunction,
  UseMutationResult,
} from '@tanstack/react-query';
import { usePostFileApiWithErrorToast } from '../generics/usePostFileApi';

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

export const useAvatarUpload = (): Omit<
  UseMutationResult<AvatarUploadResBody, unknown, AvatarFormData, unknown>,
  'mutateAsync'
> & {
  uploadAvatar: UploadAvatar;
} => {
  const { mutateAsync: uploadAvatar, ...useMutationResult } =
    usePostFileApiWithErrorToast<AvatarUploadResBody>('/users/me/avatar', [
      ['/users/me/profile'],
      ['/game/matches'],
    ]);

  return { uploadAvatar, ...useMutationResult };
};
