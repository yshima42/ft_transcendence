import { memo, FC } from 'react';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Spacer,
  Stack,
} from '@chakra-ui/react';
import { useProfile } from 'hooks/api';
import { useNavigate } from 'react-router-dom';
import { Player } from '../hooks/useGame';
import { AvatarWithNickname } from './AvatarWithNickname';

type Props = {
  player1: Player;
  player2: Player;
};

export const Result: FC<Props> = memo((props) => {
  const { player1, player2 } = props;

  const { user: user1 } = useProfile(player1.id);
  const { user: user2 } = useProfile(player2.id);
  const navigate = useNavigate();

  return (
    <>
      <Flex align="center" justify="center" height="40vh">
        <Box bg="white" w="md" p={4} borderRadius="md" shadow="md">
          <Flex alignItems="center" p={4}>
            <Spacer />
            <AvatarWithNickname user={user1} />
            <Spacer />
            <Heading as="h2" size="lg" textAlign="center">
              {player1.score} - {player2.score}
            </Heading>
            <Spacer />
            <AvatarWithNickname user={user2} />
            <Spacer />
          </Flex>
          <Divider />
          <Stack py={3} align="center">
            <Button
              onClick={() => {
                navigate('/app');
              }}
            >
              Top
            </Button>
          </Stack>
        </Box>
      </Flex>
    </>
  );
});
