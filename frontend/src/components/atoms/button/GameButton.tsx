import { memo, FC } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

type Props = ButtonProps & {
  targetId: string;
};

export const GameButton: FC<Props> = memo((props) => {
  const { targetId, ...buttonProps } = props;

  return (
    <Link to={'/app/inviting'} state={{ targetId }}>
      <Button mr={2} size="sm" {...buttonProps}>
        Game
      </Button>
    </Link>
  );
});
