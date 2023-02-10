import { memo, FC } from 'react';
import { Center, Flex } from '@chakra-ui/react';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { GameOutlineCard } from '../components/GameOutlineCard';
import { useGameMonitoring } from '../hooks/useGameMonitoring';

export const InGameList: FC = memo(() => {
  const { inGameOutlineMap } = useGameMonitoring();

  const gameOutlineCards: JSX.Element[] = [];
  inGameOutlineMap.forEach((value, key) => {
    gameOutlineCards.push(<GameOutlineCard key={key} gameOutline={value} />);
  });

  return (
    <ContentLayout title="In-Game List">
      <Flex flexDirection="column" align="center" justify="center" gap="3">
        {gameOutlineCards.length === 0 ? (
          <Center h="50vh">No games in progress.</Center>
        ) : (
          gameOutlineCards
        )}
      </Flex>
    </ContentLayout>
  );
});
