import { memo, FC } from 'react';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Spacer,
  Stack,
  VStack,
} from '@chakra-ui/react';
import { useProfile } from 'hooks/api';
import { useNavigate } from 'react-router-dom';
import { LinkedNickname } from 'components/atoms/text/LinkedNickname';
import { UserAvatar } from 'components/organisms/avatar/UserAvatar';
import { Player } from '../hooks/useGame';

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
            <VStack alignItems={'center'}>
              <UserAvatar id={user1.id} src={user1.avatarImageUrl} />
              <LinkedNickname
                id={user1.id}
                nickname={user1.nickname}
                maxWidth={200}
              />
            </VStack>
            <Spacer />
            <Heading as="h2" size="lg" textAlign="center">
              {player1.score} - {player2.score}
            </Heading>
            <Spacer />
            <VStack alignItems={'center'}>
              <UserAvatar id={user2.id} src={user2.avatarImageUrl} />
              <LinkedNickname
                id={user2.id}
                nickname={user2.nickname}
                maxWidth={200}
              />
            </VStack>
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
