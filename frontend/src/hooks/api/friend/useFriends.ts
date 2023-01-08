import { User } from '@prisma/client';
import { useGetApiOmitUndefined } from '../generics/useGetApi';

export const useFriends = (): { users: User[] } => {
  const { data: users } = useGetApiOmitUndefined<User[]>('/users/me/friends');

  return { users };
};
