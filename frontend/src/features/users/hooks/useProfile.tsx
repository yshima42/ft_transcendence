import { User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { axios } from '../../../lib/axios';

const fetchProfile = (userId: string) => {
  return async (): Promise<User> => {
    const result = await axios.get<User>(`/users/${userId}/profile`);

    return result.data;
  };
};

export const useProfile = (userId: string): { user: User } => {
  const { data: user } = useQuery<User>(
    ['profile', userId],
    fetchProfile(userId)
  );
  const navigate = useNavigate();

  if (user === undefined) {
    navigate('/', { replace: true });
    throw new Error('Error in userProfile');
  }

  return { user };
};
