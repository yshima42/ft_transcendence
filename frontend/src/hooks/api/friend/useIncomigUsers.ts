import { User } from '@prisma/client';
import { useCustomGetApi } from '../generics/useGetApi';

export const useIncomingUsers = (): { users: User[] } => {
  const { data: users } = useCustomGetApi<User[]>(
    '/users/me/friend-requests/incoming'
  );

  return { users };
};
