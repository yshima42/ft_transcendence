import { ResponseDm } from 'features/dm/types/dm';
import { useCustomGetApi } from '../generics/useGetApi';

export const useSavedDms = (dmRoomId: string): { savedDms: ResponseDm[] } => {
  const { data: savedDms } = useCustomGetApi<ResponseDm[]>(
    `/dm/rooms/${dmRoomId}/messages`
  );

  return { savedDms };
};
