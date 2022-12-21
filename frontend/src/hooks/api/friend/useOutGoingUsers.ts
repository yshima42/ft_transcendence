import { User } from '@prisma/client';
import { useGetApi } from '../generics/useGetApi';

export const useOutGoingUsers = (): { users: User[] } => {
  const { data: users } = useGetApi<User[]>(
    '/users/me/friend-requests/outgoing'
  );

  return { users };
};
