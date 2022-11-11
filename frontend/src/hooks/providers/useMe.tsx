import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User } from 'types/api/user';

export const useMe = (): string => {
  const [me, setMe] = useState('');
  const navigate = useNavigate();

  axios
    .get<User>('http://localhost:3000/user/me', { withCredentials: true })
    .then((res) => {
      setMe(res.data.name);
    })
    .catch(() => navigate('/', { replace: true }));

  return me;
};
