import { memo, FC } from 'react';
import { Box, Button, Center, Image, VStack } from '@chakra-ui/react';
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
      <Center h="400px">
        <VStack>
          <Box>
            <Image
              src="https://i.pinimg.com/originals/f6/bf/f5/f6bff5da3b05f36d85d13a778836ebeb.gif"
              alt="Pong"
            />
          </Box>
          <Box>
            {gameRoomId === undefined ? (
              <Button
                onClick={() => navigate('/app/game/matching')}
                bg="teal.300"
                color="white"
              >
                Match
              </Button>
            ) : (
              <Button onClick={() => navigate(`/app/game/rooms/${gameRoomId}`)}>
                Reconnect
              </Button>
            )}
          </Box>
        </VStack>
      </Center>
    </ContentLayout>
  );
});
