import { useGetApi } from '../generics/useGetApi';

export type FriendRelation = 'NONE' | 'ACCEPTED' | 'PENDING' | 'RECOGNITION';

export const useFriendRelation = (
  userId: string
): { friendRelation: FriendRelation } => {
  const {
    data: { friendRelation },
  } = useGetApi<{ friendRelation: FriendRelation }>(
    `/users/me/friend-relations/${userId}`,
    ['friend-relations', { userId }]
  );

  return { friendRelation };
};
