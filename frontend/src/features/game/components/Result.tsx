import { memo, FC } from 'react';
import { Box, Button, Divider, Flex, Heading, Stack } from '@chakra-ui/react';
import { useProfile } from 'hooks/api';
import { useNavigate } from 'react-router-dom';
import { Player } from '../hooks/useGame';

type Props = {
  player1: Player;
  player2: Player;
};

export const Result: FC<Props> = memo((props) => {
  const { player1, player2 } = props;

  const { user: user1 } = useProfile(player1.id);
  const { user: user2 } = useProfile(player2.id);
  const [player1Nickname, player2Nickname] = [user1.nickname, user2.nickname];
  const navigate = useNavigate();

  // TODO: Winnerの表示実装。Winnerをバック、フロントどちらで実装するか検討
  // TODO: Top画面への遷移実装。現在ゲームページがappで行われているため動かない。
  return (
    <>
      <Flex align="center" justify="center" height="40vh">
        <Box bg="white" w="md" p={4} borderRadius="md" shadow="md">
          <Heading as="h2" size="md" textAlign="center">
            {player1Nickname} vs {player2Nickname}
          </Heading>
          <Heading as="h2" size="lg" textAlign="center">
            {player1.score} - {player2.score}
          </Heading>
          <Divider />
          <Stack spacing={4} py={4} px={10} align="center">
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
