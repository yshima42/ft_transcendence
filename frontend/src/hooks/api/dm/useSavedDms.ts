import { ResponseDm } from 'features/dm/types/dm';
import { useGetApiOmitUndefined } from '../generics/useGetApi';

export const useSavedDms = (dmRoomId: string): { savedDms: ResponseDm[] } => {
  const { data: savedDms } = useGetApiOmitUndefined<ResponseDm[]>(
    `/dm/rooms/${dmRoomId}/messages`
  );

  return { savedDms };
};
