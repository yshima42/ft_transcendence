import { User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { axios } from '../../../lib/axios';

export interface AvatarFormBody {
  file: File;
}

export interface ProfileFormBody {
  nickname: string;
}

const saveProfile = (
  profileFormBody: ProfileFormBody,
  avatarFormBody: AvatarFormBody
) => {
  return async (): Promise<[User, User]> => {
    const result = await Promise.all([
      axios.post<User>('/profile', profileFormBody),
      axios.post<User>('/profile/avatar', avatarFormBody),
    ]);

    return [result[0].data, result[1].data];
  };
};

export const useSaveProfile = (
  profileFormBody: ProfileFormBody,
  avatarFormBody: AvatarFormBody
): [User, User] => {
  const { data } = useQuery<[User, User]>(
    ['save-profile'],
    saveProfile(profileFormBody, avatarFormBody)
  );
  const navigate = useNavigate();

  if (data === undefined) {
    navigate('/', { replace: true });
    throw new Error('Error in userProfile');
  }

  return data;
};
