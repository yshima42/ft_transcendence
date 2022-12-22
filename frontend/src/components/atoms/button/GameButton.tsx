import { memo, FC } from 'react';
import { Button } from '@chakra-ui/react';

type Props = {
  targetId: string;
  size?: string;
};

export const GameButton: FC<Props> = memo((props) => {
  const { targetId, size = 'sm' } = props;

  const onClickGame = () => {
    alert(`Game with ${targetId}`);
  };

  return (
    <Button size={size} onClick={onClickGame}>
      Game
    </Button>
  );
});
