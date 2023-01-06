import { ResponseDmRoom } from 'features/dm/types/dm';
import { useCustomGetApi } from '../generics/useGetApi';

export const useDmRooms = (): { dmRooms: ResponseDmRoom[] } => {
  const { data: dmRooms } = useCustomGetApi<ResponseDmRoom[]>(`/dm/rooms`);

  return { dmRooms };
};
