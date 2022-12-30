import { ResponseDmRoom } from 'features/dm/types/dm';
import { useGetApi } from '../generics/useGetApi';

export const useDmRooms = (): { dmRooms: ResponseDmRoom[] } => {
  const { data: dmRooms } = useGetApi<ResponseDmRoom[]>(`/dm/rooms`);

  return { dmRooms };
};
