import { useCallback, useState } from 'react';
import { User } from '@prisma/client';
import { useNavigate } from 'react-router-dom';
import { axios } from '../../../lib/axios';

export const useAllRequests = (): {
  getRequests: () => void;
  requests: User[];
} => {
  const [requests, setRequests] = useState<User[]>([]);
  const navigate = useNavigate();

  const getRequests = useCallback(() => {
    axios
      .get<User[]>('/friendships/outgoing')
      .then((res) => setRequests(res.data))
      .catch(() => navigate('/', { replace: true }));
  }, [navigate]);

  return { getRequests, requests };
};
