import { User } from '@prisma/client';
import { useGetApiOmitUndefined } from '../generics/useGetApi';

export const useOutGoingUsers = (): { users: User[] } => {
  const { data: users } = useGetApiOmitUndefined<User[]>(
    '/users/me/friend-requests/outgoing'
  );

  return { users };
};
