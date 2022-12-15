import { useBlockUsers } from 'hooks/api';

export const useIsBlockedUser = (
  userId: string
): { isBlockedUser: boolean } => {
  const { users: blockedUsers } = useBlockUsers();
  const isBlockedUser =
    blockedUsers.find((blockedUser) => blockedUser.id === userId) !== undefined;

  return { isBlockedUser };
};
