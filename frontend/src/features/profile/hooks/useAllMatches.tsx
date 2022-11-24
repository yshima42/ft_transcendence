import { useCallback, useState } from 'react';
import { MatchResult } from '@prisma/client';
import { useNavigate } from 'react-router-dom';
import { axios } from '../../../lib/axios';

export const useAllMatches = (): {
  getMatches: () => void;
  loading: boolean;
  matches: MatchResult[];
} => {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const navigate = useNavigate();

  const getMatches = useCallback(() => {
    setLoading(true);
    axios
      .get<MatchResult[]>('/game/matches')
      .then((res) => setMatches(res.data))
      .catch(() => navigate('/', { replace: true }))
      .finally(() => setLoading(false));
  }, []);

  return { getMatches, loading, matches };
};
