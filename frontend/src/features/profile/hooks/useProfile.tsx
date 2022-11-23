import { User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { axios } from '../../../lib/axios';

export const fetchProfile = async (): Promise<User> => {
  const result = await axios.get<User>('/prof');

  return result.data;
};

export const useProfile = (): { user: User } => {
  const { data: user } = useQuery<User>(['profile'], fetchProfile);
  const navigate = useNavigate();

  if (user === undefined) {
    navigate('/', { replace: true });
    throw new Error('Error in userProfile');
  }

  return { user };
};
