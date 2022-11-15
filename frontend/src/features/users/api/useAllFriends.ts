import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { axios } from '../../../lib/axios';
import { User } from '../types/user';

export const useAllFriends = (): {
  getFriends: () => void;
  friends: User[];
} => {
  const [friends, setFriends] = useState<User[]>([]);
  const navigate = useNavigate();

  const getFriends = useCallback(() => {
    // ここをfriend取得のAPIに変える
    axios
      .get<User[]>('/users/all')
      .then((res) => setFriends(res.data))
      .catch(() => navigate('/', { replace: true }));
  }, [navigate]);

  return { getFriends, friends };
};
