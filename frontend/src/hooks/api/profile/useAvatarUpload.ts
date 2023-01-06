import { User } from '@prisma/client';
import {
  UseMutateAsyncFunction,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
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

export const useAvatarUpload = (): Omit<
  UseMutationResult<AvatarUploadResBody, unknown, AvatarFormData, unknown>,
  'mutateAsync'
> & {
  uploadAvatar: UploadAvatar;
} => {
  const queryClient = useQueryClient();
  const { customToast } = useCustomToast();

  const { mutateAsync: uploadAvatar, ...useMutationResult } =
    usePostFileApi<AvatarUploadResBody>('/users/me/avatar', {
      onSuccess: () => {
        const queryKeys = [['/users/me/profile'], ['/game/matches']];
        queryKeys.forEach((queryKey) => {
          void queryClient.invalidateQueries({ queryKey });
        });
      },
      onError: (error) => {
        if (isAxiosError<{ message: string }>(error)) {
          customToast({ description: error.response?.data.message });
        }
      },
    });

  return { uploadAvatar, ...useMutationResult };
};
