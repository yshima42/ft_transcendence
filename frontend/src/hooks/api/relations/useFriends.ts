import { User } from '@prisma/client';
import { useGetApi } from '../generics/useGetApi';

export const useFriends = (): { users: User[] } => {
  const { data: users } = useGetApi<User[]>('/users/me/friends');

  return { users };
};
