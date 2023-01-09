import { memo, FC } from 'react';
import { Button, Center } from '@chakra-ui/react';
import { useProfile } from 'hooks/api';
import { useGameRoomId } from 'hooks/utils/useGameRoomId';
import { useNavigate } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';

export const Top: FC = memo(() => {
  const navigate = useNavigate();
  const { user } = useProfile();
  const { gameRoomId } = useGameRoomId(user.id);

  return (
    <ContentLayout title="">
      <Center>
        {gameRoomId === undefined ? (
          <Button onClick={() => navigate('/app/game/matching')}>Match</Button>
        ) : (
          <Button onClick={() => navigate(`/app/game/rooms/${gameRoomId}`)}>
            Reconnect
          </Button>
        )}
      </Center>
    </ContentLayout>
  );
});
