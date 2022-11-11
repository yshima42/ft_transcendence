import { useCallback, useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { User } from 'types/api/user';

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
  }, []);

  return { getUsers, users };
};
