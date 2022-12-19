import { memo, FC } from 'react';
import { Box, Button } from '@chakra-ui/react';

type Props = {
  isGamePlaying: boolean;
};

export const GameButton: FC<Props> = memo((props) => {
  const { isGamePlaying } = props;

  const onClickGame = () => {
    alert('Game');
  };

  const onClickWatch = () => {
    alert('Watch');
  };

  return (
    <Box p={2}>
      <Button size="sm" onClick={isGamePlaying ? onClickWatch : onClickGame}>
        {isGamePlaying ? 'Watch' : 'Game'}
      </Button>
    </Box>
  );
});
