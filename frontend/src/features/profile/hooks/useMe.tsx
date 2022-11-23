import { User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { axios } from '../../../lib/axios';

export const fetchMe = async (): Promise<User> => {
  const result = await axios.get<User>('/profile');

  return result.data;
};

export const useMe = (): { user: User } => {
  const { data: user } = useQuery<User>(['me'], fetchMe);
  const navigate = useNavigate();

  if (user === undefined) {
    navigate('/', { replace: true });
    throw new Error('Error in userProfile');
  }

  return { user };
};
