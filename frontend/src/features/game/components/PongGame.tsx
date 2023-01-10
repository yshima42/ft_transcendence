import { memo, FC } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { useProfile } from 'hooks/api';
import { useCanvas } from '../hooks/useCanvas';
import { Player } from '../utils/gameObjs';
import { AvatarWithNickname } from './AvatarWithNickname';

type Props = {
  player1: Player;
  player2: Player;
  canvas: {
    width: number;
    height: number;
    ratio: number;
    draw: (ctx: CanvasRenderingContext2D) => void;
  };
};

export const PongGame: FC<Props> = memo((props) => {
  const { player1, player2, canvas } = props;

  const canvasRef = useCanvas(canvas);
  const { user: user1 } = useProfile(player1.id);
  const { user: user2 } = useProfile(player2.id);

  return (
    <Flex alignItems="center" p={4}>
      <Box p={2}>
        <AvatarWithNickname user={user1} />
      </Box>
      <canvas ref={canvasRef} />
      <Box p={2}>
        <AvatarWithNickname user={user2} />
      </Box>
    </Flex>
  );
});
