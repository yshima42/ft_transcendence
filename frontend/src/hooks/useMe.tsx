import { useState } from 'react';
import { User } from '@prisma/client';
import { useNavigate } from 'react-router-dom';

import { axios } from '../lib/axios';

export const useMe = (): string => {
  const [me, setMe] = useState('');
  const navigate = useNavigate();

  axios
    .get<User>('/users/me')
    .then((res) => {
      setMe(res.data.name);
    })
    .catch(() => navigate('/', { replace: true }));

  return me;
};
