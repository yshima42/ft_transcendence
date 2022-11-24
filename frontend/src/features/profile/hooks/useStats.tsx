import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  if (stats === undefined) {
    navigate('/', { replace: true });
    throw new Error('Error in userProfile');
  }

  return { stats };
};
