import { useCallback, useState } from 'react';
import axios from 'axios';

import { User } from 'types/api/user';

export const useAllUsers = (): {
  getUsers: () => void;
  users: User[];
} => {
  const [users, setUsers] = useState<User[]>([]);

  const getUsers = useCallback(() => {
    axios
      .get<User[]>('http://localhost:3000/user/all', { withCredentials: true })
      .then((res) => setUsers(res.data))
      .catch(() => alert('error'));
  }, []);

  return { getUsers, users };
};
