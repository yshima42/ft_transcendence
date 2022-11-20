import { User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

import { axios } from '../../../lib/axios';

const fetchUsers = async () => {
  const result = await axios.get<User[]>('/users/all');

  return result.data;
};

export const useAllUsers = (): User[] | undefined => {
  const { data } = useQuery<User[]>(['users'], fetchUsers);

  return data;
};

// import { useCallback, useState } from 'react';
// import { User } from '@prisma/client';
// import { useNavigate } from 'react-router-dom';

// import { axios } from '../../../lib/axios';

// export const useAllUsers = (): {
//   getUsers: () => void;
//   users: User[];
// } => {
//   const [users, setUsers] = useState<User[]>([]);
//   const navigate = useNavigate();

//   const getUsers = useCallback(() => {
//     axios
//       .get<User[]>('/users/all')
//       .then((res) => setUsers(res.data))
//       .catch(() => navigate('/', { replace: true }));
//   }, [navigate]);

//   return { getUsers, users };
// };
