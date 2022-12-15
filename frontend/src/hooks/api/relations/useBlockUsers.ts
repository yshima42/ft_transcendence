import { User } from '@prisma/client';
import { useGetApi } from '../generics/useGetApi';

export const useBlockUsers = (): { users: User[] } => {
  const { data: users } = useGetApi<User[]>('/users/me/blocks');

  return { users };
};

export const useIsBlockedUser = (
  userId: string
): { isBlockedUser: boolean } => {
  const { users: blockedUsers } = useBlockUsers();
  const isBlockedUser =
    blockedUsers.find((blockedUser) => blockedUser.id === userId) !== undefined;

  return { isBlockedUser };
};
