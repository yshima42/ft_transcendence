import React, { FC, memo } from 'react';
import { Button } from '@chakra-ui/react';
import { GamePhase } from '../hooks/useGame';

type Props = {
  setGamePhase: React.Dispatch<React.SetStateAction<GamePhase>>;
};

export const GameTop: FC<Props> = memo((props) => {
  const { setGamePhase } = props;

  return (
    <Button onClick={() => setGamePhase(GamePhase.Matching)}>Match</Button>
  );
});
