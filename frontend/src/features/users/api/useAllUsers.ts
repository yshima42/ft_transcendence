import { useCallback, useState } from 'react';
import axios from 'axios';

import { User } from 'features/users/types/user';
import { useNavigate } from 'react-router-dom';

export const useAllUsers = (): {
  getUsers: () => void;
  users: User[];
} => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  const getUsers = useCallback(() => {
    axios
      .get<User[]>('http://localhost:3000/user/all', { withCredentials: true })
      .then((res) => setUsers(res.data))
      .catch(() => navigate('/', { replace: true }));
    // .catch(() => alert('error'));
  }, [navigate]);

  return { getUsers, users };
};
