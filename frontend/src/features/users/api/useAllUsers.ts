import { useCallback, useState } from 'react';
import { User } from 'features/users/types/user';
import { useNavigate } from 'react-router-dom';

import { axios } from '../../../lib/axios';

export const useAllUsers = (): {
  getUsers: () => void;
  users: User[];
} => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  const getUsers = useCallback(() => {
    axios
      .get<User[]>('/user/all')
      .then((res) => setUsers(res.data))
      .catch(() => navigate('/', { replace: true }));
  }, [navigate]);

  return { getUsers, users };
};
