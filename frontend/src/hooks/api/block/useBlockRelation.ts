import { useGetApi } from '../generics/useGetApi';

export const useBlockRelation = (
  targetId: string
): { isUserBlocked: boolean } => {
  const {
    data: { isUserBlocked },
  } = useGetApi<{ isUserBlocked: boolean }>(
    `/users/me/block-relations/${targetId}`
  );

  return { isUserBlocked };
};
