import { User } from '@prisma/client';
import { useCustomGetApi } from '../generics/useGetApi';

export const useOutGoingUsers = (): { users: User[] } => {
  const { data: users } = useCustomGetApi<User[]>(
    '/users/me/friend-requests/outgoing'
  );

  return { users };
};
