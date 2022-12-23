import { memo, FC } from 'react';
import { Flex } from '@chakra-ui/react';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { GameOutlineCard } from '../components/GameOutlineCard';
import { useGameMonitoring } from '../hooks/useGameMonitoring';

export const Games: FC = memo(() => {
  const { inGameOutlines } = useGameMonitoring();

  return (
    <ContentLayout title="In-Game List">
      <Flex align="center" justify="center">
        {inGameOutlines.map((inGameOutline) => (
          <GameOutlineCard
            key={inGameOutline.roomId}
            gameOutline={inGameOutline}
          />
        ))}
      </Flex>
    </ContentLayout>
  );
});
