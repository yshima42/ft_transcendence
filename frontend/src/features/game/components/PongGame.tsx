import { memo, FC } from 'react';
import { Flex } from '@chakra-ui/react';
import { useProfile } from 'hooks/api';
import { useCanvas } from '../hooks/useCanvas';
import { Player } from '../utils/gameObjs';
import { AvatarWithNickname } from './AvatarWithNickname';

type Props = {
  player1: Player;
  player2: Player;
  draw: (ctx: CanvasRenderingContext2D) => void;
  canvasSize: { width: number; height: number; ratio: number };
};

export const PongGame: FC<Props> = memo((props) => {
  const { player1, player2, draw, canvasSize } = props;

  const canvasRef = useCanvas(draw, canvasSize);
  const { user: user1 } = useProfile(player1.id);
  const { user: user2 } = useProfile(player2.id);

  return (
    <Flex alignItems="center" p={4}>
      <AvatarWithNickname user={user1} />
      <canvas ref={canvasRef} />
      <AvatarWithNickname user={user2} />
    </Flex>
  );
});
