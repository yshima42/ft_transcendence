import { useCallback, useState } from 'react';
import { User } from '@prisma/client';
import { useNavigate } from 'react-router-dom';

import { axios } from '../lib/axios';

export const useOpponent = (): {
  getOpponent: (opponentId: string) => void;
  opponentLoading: boolean;
  opponent: User | undefined;
} => {
  const [opponentLoading, setOpponentLoading] = useState(false);
  const [opponent, setOpponent] = useState<User>();
  const navigate = useNavigate();

  const getOpponent = useCallback(
    (opponentId: string) => {
      axios
        .get<User>(`/users/${opponentId}/profile`)
        .then((res) => setOpponent(res.data))
        .catch(() => navigate('/', { replace: true }))
        .finally(() => setOpponentLoading(false));
    },
    [navigate]
  );

  return { getOpponent, opponentLoading, opponent };
};
