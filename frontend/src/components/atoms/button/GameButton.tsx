import { memo, FC } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

type Props = ButtonProps & {
  targetId: string;
};

export const GameButton: FC<Props> = memo((props) => {
  const { targetId, ...buttonProps } = props;

  const onClickGame = () => {
    alert(`Game with ${targetId}`);
  };

  return (
    <Button size="sm" onClick={onClickGame} {...buttonProps}>
      Game
    </Button>
  );
});
