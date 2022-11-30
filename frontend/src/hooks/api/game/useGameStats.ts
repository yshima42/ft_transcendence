import { useGetApi } from '../generics/useGetApi';

export interface GameStats {
  winNum: number;
  loseNum: number;
}

export const useGameStats = (userId = 'me'): { gameStats: GameStats } => {
  const endpoint =
    userId === 'me' ? '/game/stats' : `/users/${userId}/game/stats`;

  const { data: gameStats } = useGetApi<GameStats>(endpoint);

  return { gameStats };
};
