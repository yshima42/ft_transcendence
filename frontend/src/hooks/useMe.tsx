import { useCallback, useState } from 'react';
import { User } from '@prisma/client';
import { useNavigate } from 'react-router-dom';

import { axios } from '../lib/axios';

export const useMe = (): {
  getMe: () => void;
  meLoading: boolean;
  me: User | undefined;
} => {
  const [meLoading, setMeLoading] = useState(false);
  const [me, setMe] = useState<User>();
  const navigate = useNavigate();

  const getMe = useCallback(() => {
    setMeLoading(true);
    axios
      .get<User>('/profile')
      .then((res) => setMe(res.data))
      .catch(() => navigate('/', { replace: true }))
      .finally(() => setMeLoading(false));
  }, [navigate]);

  return { getMe, meLoading, me };
};
