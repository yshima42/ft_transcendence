import { memo, FC } from 'react';
import { Flex } from '@chakra-ui/react';
import { useProfile } from 'hooks/api';
import { useCanvas } from '../hooks/useCanvas';
import { Player } from '../hooks/useGame';
import {
  BACKEND_CANVAS_HEIGHT,
  BACKEND_CANVAS_WIDTH,
} from '../utils/gameConfig';
import { AvatarWithNickname } from './AvatarWithNickname';

type Props = {
  draw: (ctx: CanvasRenderingContext2D) => void;
  player1: Player;
  player2: Player;
};

export const PongGame: FC<Props> = memo((props) => {
  const { draw, player1, player2 } = props;

  const canvasRef = useCanvas(draw);
  const { user: user1 } = useProfile(player1.id);
  const { user: user2 } = useProfile(player2.id);
  // const { canvasWidth, canvasHeight } = useCanvasSize();

  return (
    <Flex alignItems="center" p={4}>
      <AvatarWithNickname user={user1} />
      <canvas
        width={BACKEND_CANVAS_WIDTH}
        height={BACKEND_CANVAS_HEIGHT}
        ref={canvasRef}
      />
      <AvatarWithNickname user={user2} />
    </Flex>
  );
});
