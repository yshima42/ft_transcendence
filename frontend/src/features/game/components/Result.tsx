import { memo, FC } from 'react';
import { Box, Button, Divider, Flex, Heading, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { GameResult } from '../hooks/useGame';

type Props = {
  gameResult: GameResult;
};

export const Result: FC<Props> = memo((props) => {
  const { gameResult } = props;
  const navigate = useNavigate();

  // TODO: Winnerの表示実装。Winnerをバック、フロントどちらで実装するか検討
  // TODO: Top画面への遷移実装。現在ゲームページがappで行われているため動かない。
  return (
    <>
      <Flex align="center" justify="center" height="40vh">
        <Box bg="white" w="md" p={4} borderRadius="md" shadow="md">
          <Heading as="h2" size="md" textAlign="center">
            {gameResult.player1Nickname} vs {gameResult.player2Nickname}
          </Heading>
          <Heading as="h2" size="lg" textAlign="center">
            {gameResult.player1Score} - {gameResult.player2Score}
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
