import { useQuery } from '@tanstack/react-query';
import { axios } from '../../../lib/axios';

export interface Stats {
  winNum: number;
  loseNum: number;
}

export const fetchStats = async (): Promise<Stats> => {
  const result = await axios.get<Stats>('/game/stats');

  return result.data;
};

export const useStats = (): { stats: Stats } => {
  const { data: stats } = useQuery<Stats>(['stats'], fetchStats);

  // TODO エラーの場合、useQuery内で例外が投げられるので、ここにはいつ入るかわかってない。
  if (stats === undefined) {
    throw new Error('Error in userProfile');
  }

  return { stats };
};
