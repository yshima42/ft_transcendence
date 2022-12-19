import { memo, FC } from 'react';
import { Center } from '@chakra-ui/react';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { GameTop } from '../components/GameTop';
import { Matching } from '../components/Matching';
import { MatchState, useGameMatching } from '../hooks/useGameMatching';

export const Top: FC = memo(() => {
  const { matchState, setMatchState } = useGameMatching();

  return (
    <ContentLayout title="">
      <Center>
        {matchState === MatchState.None ? (
          <GameTop setMatchState={setMatchState} />
        ) : (
          <Matching setMatchState={setMatchState} />
        )}
      </Center>
    </ContentLayout>
  );
});
