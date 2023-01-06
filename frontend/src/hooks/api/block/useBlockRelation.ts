import { useCustomGetApi } from '../generics/useGetApi';

export const useBlockRelation = (
  targetId: string
): { isUserBlocked: boolean } => {
  const {
    data: { isUserBlocked },
  } = useCustomGetApi<{ isUserBlocked: boolean }>(
    `/users/me/block-relations/${targetId}`
  );

  return { isUserBlocked };
};
