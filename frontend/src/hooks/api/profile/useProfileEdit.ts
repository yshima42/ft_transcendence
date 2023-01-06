import { User } from '@prisma/client';
import {
  UseMutateAsyncFunction,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useCustomToast } from 'hooks/utils/useCustomToast';
import { usePostApi } from '../generics/usePostApi';

export interface ProfileFormData {
  nickname?: string;
  twoFactor?: boolean;
}

export interface ProfileEditResBody {
  user: User;
}

export type EditProfile = UseMutateAsyncFunction<
  ProfileEditResBody,
  unknown,
  ProfileFormData,
  unknown
>;

export const useProfileEdit = (): Omit<
  UseMutationResult<ProfileEditResBody, unknown, ProfileFormData, unknown>,
  'mutateAsync'
> & { editProfile: EditProfile } => {
  const queryClient = useQueryClient();
  const { customToast } = useCustomToast();

  const { mutateAsync: editProfile, ...useMutationResult } = usePostApi<
    ProfileFormData,
    ProfileEditResBody
  >(`/users/me/profile`, {
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

  return { editProfile, ...useMutationResult };
};
