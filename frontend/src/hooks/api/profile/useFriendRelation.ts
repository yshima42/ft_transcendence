import { useGetApi } from '../generics/useGetApi';

export type FriendRelation = 'NONE' | 'ACCEPTED' | 'PENDING' | 'RECOGNITION';

export const useFriendRelation = (
  targetId: string
): { friendRelation: FriendRelation } => {
  const {
    data: { friendRelation },
  } = useGetApi<{ friendRelation: FriendRelation }>(
    `/users/me/friend-relations/${targetId}`,
    ['friend-relations', { targetId }]
  );

  return { friendRelation };
};
