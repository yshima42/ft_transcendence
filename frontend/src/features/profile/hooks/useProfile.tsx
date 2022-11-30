import { User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { axios } from '../../../lib/axios';

export const fetchProfile = async (): Promise<User> => {
  const result = await axios.get<User>('/users/me/profile');

  return result.data;
};

export const useProfile = (): { user: User } => {
  const { data: user } = useQuery<User>(['profile'], fetchProfile);

  // TODO エラーの場合、useQuery内で例外が投げられるので、ここにはいつ入るかわかってない。
  if (user === undefined) {
    // このthrowがないと、下のreturn まで行き、User|undefined で返さないといけなくなる。
    throw new Error('Error in userProfile');
  }

  return { user };
};
