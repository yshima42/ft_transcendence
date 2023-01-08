import { useGetApiOmitUndefined } from '../generics/useGetApi';

export const useBlockRelation = (
  targetId: string
): { isUserBlocked: boolean } => {
  const {
    data: { isUserBlocked },
  } = useGetApiOmitUndefined<{ isUserBlocked: boolean }>(
    `/users/me/block-relations/${targetId}`
  );

  return { isUserBlocked };
};
