import { ResponseDmRoom } from 'features/dm/types';
import { useGetApi } from '../generics/useGetApi';

export const useDmRooms = (): { dmRooms: ResponseDmRoom[] } => {
  const { data: dmRooms } = useGetApi<ResponseDmRoom[]>(`/dm/room/me`);

  return { dmRooms };
};
