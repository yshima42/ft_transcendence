import { memo, FC } from 'react';
import { GamesList } from '../components/GamesList';

export const Games: FC = memo(() => {
  return <GamesList />;
});
