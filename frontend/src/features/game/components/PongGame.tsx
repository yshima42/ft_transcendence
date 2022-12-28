import { memo, FC } from 'react';
import { Box, Flex, Grid, GridItem, Spacer } from '@chakra-ui/react';
import { useProfile } from 'hooks/api';
import { useCanvas } from '../hooks/useCanvas';
import { useCanvasSize } from '../hooks/useCanvasSize';
import { Player } from '../hooks/useGame';
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
  const { canvasWidth, canvasHeight } = useCanvasSize();

  return (
    <Grid
      templateAreas={`"header"
                      main`}
      gridTemplateRows={'50px 1fr 30px'}
      gridTemplateColumns={'150px 1fr'}
      h="200px"
      gap="1"
      color="blackAlpha.700"
      fontWeight="bold"
    >
      <GridItem pl="2" bg="orange.300" area={'header'}>
        <Flex>
          <Box>
            <AvatarWithNickname user={user1} />
          </Box>
          <Spacer />
          <Box>
            <AvatarWithNickname user={user2} />
          </Box>
        </Flex>
      </GridItem>
      <GridItem pl="2" bg="green.300" area={'main'}>
        <Flex alignItems="center" p={4}>
          <canvas width={canvasWidth} height={canvasHeight} ref={canvasRef} />
        </Flex>
      </GridItem>
    </Grid>
  );
});
