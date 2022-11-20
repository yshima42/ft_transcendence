import { User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

import { axios } from '../../../lib/axios';

const fetchBlock = async () => {
  const result = await axios.get<User[]>('/users/all');

  return result.data;
};

export const useAllBlock = (): User[] | undefined => {
  const { data } = useQuery<User[]>(['block'], fetchBlock);

  return data;
};

// import { useCallback, useState } from 'react';
// import { User } from '@prisma/client';
// import { useNavigate } from 'react-router-dom';

// import { axios } from '../../../lib/axios';

// export const useAllBlock = (): {
//   getBlock: () => void;
//   block: User[];
// } => {
//   const [block, setBlock] = useState<User[]>([]);
//   const navigate = useNavigate();

//   const getBlock = useCallback(() => {
//     // ここをfriend取得のAPIに変える
//     axios
//       .get<User[]>('/users/all')
//       .then((res) => setBlock(res.data))
//       .catch(() => navigate('/', { replace: true }));
//   }, [navigate]);

//   return { getBlock, block };
// };
