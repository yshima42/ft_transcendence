import React, { FC, memo } from 'react';
import { Button } from '@chakra-ui/react';
import { MatchState } from '../hooks/useGameMatching';

type Props = {
  setMatchState: React.Dispatch<React.SetStateAction<MatchState>>;
};

export const GameTop: FC<Props> = memo((props) => {
  const { setMatchState } = props;

  return (
    <Button onClick={() => setMatchState(MatchState.Matching)}>Match</Button>
  );
});
