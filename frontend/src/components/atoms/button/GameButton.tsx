import { memo, FC } from 'react';
import { Button } from '@chakra-ui/react';

import { Link } from 'react-router-dom';

type Props = {
  targetId: string;
  size?: string;
};

export const GameButton: FC<Props> = memo((props) => {
  const { targetId, size = 'sm' } = props;

  return (
    <Link to={'/app/inviting'} state={{ targetId }}>
      <Button mr={2} size={size}>
        Game
      </Button>
    </Link>
  );
});
