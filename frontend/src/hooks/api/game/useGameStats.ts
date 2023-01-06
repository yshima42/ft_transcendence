import { useCustomGetApi } from '../generics/useGetApi';

export interface GameStats {
  totalMatches: number;
  totalWins: number;
  totalLoses: number;
  winRate: number;
}

export const useGameStats = (userId = 'me'): { gameStats: GameStats } => {
  const endpoint =
    userId === 'me' ? '/game/stats' : `/users/${userId}/game/stats`;

  const { data: gameStats } = useCustomGetApi<GameStats>(endpoint);

  return { gameStats };
};
