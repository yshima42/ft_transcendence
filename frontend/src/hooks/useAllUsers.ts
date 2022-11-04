import { useCallback, useState } from 'react';
import axios from 'axios';

import { JsonUser } from '../types/api/jsonuser';

export const useAllUsers = (): {
  getUsers: () => void;
  users: JsonUser[];
} => {
  const [users, setUsers] = useState<JsonUser[]>([]);

  const getUsers = useCallback(() => {
    axios
      .get<JsonUser[]>('https://jsonplaceholder.typicode.com/users')
      .then((res) => setUsers(res.data))
      .catch(() => alert('error'));
  }, []);

  return { getUsers, users };
};
