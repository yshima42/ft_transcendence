import { useCallback, useState } from 'react';
import { axios } from 'lib/axios';
import { useNavigate } from 'react-router-dom';

import { Game } from '../types/game';

const mockGames: Game[] = [
  {
    createdAt: '11-14',
    id: '1',
    player1: 'dummy1',
    player2: 'dummy2',
    updatedAt: '11-14',
  },
  {
    createdAt: '11-14',
    id: '2',
    player1: 'dummy1',
    player2: 'dummy2',
    updatedAt: '11-14',
  },
  {
    createdAt: '11-14',
    id: '3',
    player1: 'dummy1',
    player2: 'dummy2',
    updatedAt: '11-14',
  },
  {
    createdAt: '11-14',
    id: '4',
    player1: 'dummy1',
    player2: 'dummy2',
    updatedAt: '11-14',
  },
  {
    createdAt: '11-14',
    id: '5',
    player1: 'dummy1',
    player2: 'dummy2',
    updatedAt: '11-14',
  },
  {
    createdAt: '11-14',
    id: '6',
    player1: 'dummy1',
    player2: 'dummy2',
    updatedAt: '11-14',
  },
];

export const useAllGames = (): {
  getGames: () => void;
  games: Game[];
} => {
  const [games, setGames] = useState<Game[]>([]);
  const navigate = useNavigate();

  const getGames = useCallback(() => {
    // ここをGamesゲットしてきてmockGamesを入れ替える
    axios
      .get<Game[]>('/users/all')
      .then(() => setGames(mockGames))
      .catch(() => navigate('/', { replace: true }));
  }, [navigate]);

  return { getGames, games };
};
