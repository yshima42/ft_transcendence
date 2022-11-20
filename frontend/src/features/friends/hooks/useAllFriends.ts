import { User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

import { axios } from '../../../lib/axios';

const fetchFriends = async () => {
  const result = await axios.get<User[]>('/users/all');

  return result.data;
};

export const useAllFriends = (): User[] | undefined => {
  const { data } = useQuery<User[]>(['friends'], fetchFriends);

  return data;
};

// import { useCallback, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// export const useAllFriends = (): {
//   getFriends: () => void;
//   friends: User[];
// } => {
//   const [friends, setFriends] = useState<User[]>([]);
//   const navigate = useNavigate();

//   const getFriends = useCallback(() => {
//     // ここをfriend取得のAPIに変える
//     axios
//       .get<User[]>('/users/all')
//       .then((res) => setFriends(res.data))
//       .catch(() => navigate('/', { replace: true }));
//   }, [navigate]);

//   return { getFriends, friends };
// };
