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

  // フリー素材(https://www.animatedimages.org/img-animated-table-tennis-image-0012-192706.htm)
  return (
    <ContentLayout title="">
      <Center h="400px">
        <VStack>
          <Box>
            <Image
              src="https://www.animatedimages.org/data/media/682/animated-table-tennis-image-0012.gif"
              alt="Pong"
            />
          </Box>
          <Box>
            {gameRoomId === undefined ? (
              <Button
                onClick={() => navigate('/app/game/matching')}
                bg="teal.300"
                color="white"
                mt="5"
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
