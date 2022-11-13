import { useState } from 'react';
import { User } from 'features/users/types/user';
import { useNavigate } from 'react-router-dom';

import { axios } from '../lib/axios';

export const useMe = (): string => {
  const [me, setMe] = useState('');
  const navigate = useNavigate();

  axios
    .get<User>('/user/me')
    .then((res) => {
      setMe(res.data.name);
    })
    .catch(() => navigate('/', { replace: true }));

  return me;
};
