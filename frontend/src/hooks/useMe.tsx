import { useCallback, useState } from 'react';
import { User } from '@prisma/client';
import { useNavigate } from 'react-router-dom';

import { axios } from '../lib/axios';

export const useMe = (): {
  getMe: () => void;
  me: User | undefined;
} => {
  const [me, setMe] = useState<User>();
  const navigate = useNavigate();

  const getMe = useCallback(() => {
    axios
      .get<User>('/users/me')
      .then((res) => {
        setMe(res.data);
      })
      .catch(() => navigate('/', { replace: true }));
  }, [navigate]);

  return { getMe, me };
};
