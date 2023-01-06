import { User } from '@prisma/client';
import { useCustomGetApi } from '../generics/useGetApi';

export const useFriends = (): { users: User[] } => {
  const { data: users } = useCustomGetApi<User[]>('/users/me/friends');

  return { users };
};
