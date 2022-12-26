import { ResponseDm } from 'features/dm/types/dm';
import { useGetApi } from '../generics/useGetApi';

export const useSavedDms = (dmRoomId: string): { savedDms: ResponseDm[] } => {
  const { data: savedDms } = useGetApi<ResponseDm[]>(
    `/dm/rooms/${dmRoomId}/messages`
  );

  return { savedDms };
};
