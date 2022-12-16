import { useGetApi } from '../generics/useGetApi';

export const useIsBlockedUser = (
  targetId: string
): { isBlockedUser: boolean } => {
  const { data: isBlockedUser } = useGetApi<boolean>(
    `/users/me/block-relation/${targetId}`
  );

  return { isBlockedUser };
};
