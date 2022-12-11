import { ResponseDm } from 'features/dm/types';
import { useGetApi } from '../generics/useGetApi';

export const useSavedDms = (dmRoomId: string): { savedDms: ResponseDm[] } => {
  const { data: savedDms } = useGetApi<ResponseDm[]>(`/dm/message/${dmRoomId}`);

  return { savedDms };
};
