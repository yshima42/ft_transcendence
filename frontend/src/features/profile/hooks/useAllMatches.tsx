import { useCallback, useState } from 'react';
import { MatchResult } from '@prisma/client';
import { axios } from '../../../lib/axios';

// TODO React-queryで書き直す
export const useAllMatches = (): {
  getMatches: () => void;
  loading: boolean;
  matches: MatchResult[];
} => {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<MatchResult[]>([]);

  const getMatches = useCallback(() => {
    setLoading(true);
    axios
      .get<MatchResult[]>('/game/matches')
      .then((res) => setMatches(res.data))
      .catch((err) => {
        // TODO handle error
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { getMatches, loading, matches };
};
