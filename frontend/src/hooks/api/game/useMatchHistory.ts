import { MatchResult } from '@prisma/client';
import { useGetApi } from '../generics/useGetApi';

export const useMatchHistory = (
  userId = 'me'
): { matchHistory: MatchResult[] } => {
  const endpoint =
    userId === 'me' ? '/game/matches' : `/users/${userId}/game/matches`;
  const { data: matchHistory } = useGetApi<MatchResult[]>(endpoint);

  return { matchHistory };
};
