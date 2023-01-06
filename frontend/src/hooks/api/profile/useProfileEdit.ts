import { User } from '@prisma/client';
import {
  UseMutateAsyncFunction,
  UseMutationResult,
} from '@tanstack/react-query';
import { usePostApiWithErrorToast } from '../generics/usePostApi';

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
  const { mutateAsync: editProfile, ...useMutationResult } =
    usePostApiWithErrorToast<ProfileFormData, ProfileEditResBody>(
      `/users/me/profile`,
      [['/users/me/profile'], ['/game/matches']]
    );

  return { editProfile, ...useMutationResult };
};
