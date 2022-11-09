import { useCallback, useContext, useState } from 'react';
import axios from 'axios';

import { User } from 'types/api/user';
import { AccessTokenContext } from './providers/useAccessTokenProvider';

export const useAllUsers = (): {
  getUsers: () => void;
  users: User[];
} => {
  const [users, setUsers] = useState<User[]>([]);
  const { token } = useContext(AccessTokenContext);

  const getUsers = useCallback(() => {
    axios.defaults.headers.common.Authorization = 'Bearer ' + token;
    axios
      .get<User[]>('http://localhost:3000/user/all')
      .then((res) => setUsers(res.data))
      .catch(() => alert('error'));
  }, []);

  return { getUsers, users };
};
