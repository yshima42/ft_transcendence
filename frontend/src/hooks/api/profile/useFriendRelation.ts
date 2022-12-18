import { useGetApi } from '../generics/useGetApi';

export type FriendRelation = 'NONE' | 'ACCEPTED' | 'PENDING' | 'RECOGNITION';

export const useFriendRelation = (
  otherId: string
): { friendRelation: FriendRelation } => {
  const {
    data: { friendRelation },
  } = useGetApi<{ friendRelation: FriendRelation }>(
    `/users/me/friend-relations/${otherId}`,
    ['friend-relations', { otherId }]
  );

  return { friendRelation };
};
