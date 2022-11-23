import { useCallback, useState } from 'react';
import { User } from '@prisma/client';
import { useNavigate } from 'react-router-dom';
import { axios } from '../../../lib/axios';

export const useAllPendings = (): {
  getPendings: () => void;
  pendings: User[];
  setPendings: React.Dispatch<React.SetStateAction<User[]>>;
} => {
  const [pendings, setPendings] = useState<User[]>([]);
  const navigate = useNavigate();

  const getPendings = useCallback(() => {
    axios
      .get<User[]>('/friendships/incoming')
      .then((res) => setPendings(res.data))
      .catch(() => navigate('/', { replace: true }));
  }, [navigate]);

  return { getPendings, pendings, setPendings };
};
