import { ResponseDmRoom } from 'features/dm/types/dm';
import { useGetApiOmitUndefined } from '../generics/useGetApi';

export const useDmRooms = (): { dmRooms: ResponseDmRoom[] } => {
  const { data: dmRooms } =
    useGetApiOmitUndefined<ResponseDmRoom[]>(`/dm/rooms`);

  return { dmRooms };
};
