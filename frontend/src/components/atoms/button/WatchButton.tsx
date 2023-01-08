import { memo, FC } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

import { Link } from 'react-router-dom';

type Props = ButtonProps & {
  gameRoomId: string;
};

export const WatchButton: FC<Props> = memo((props) => {
  const { gameRoomId, ...buttonProps } = props;

  return (
    <Link to={`/app/games/${gameRoomId}`}>
      <Button mr={2} size="sm" {...buttonProps}>
        Watch
      </Button>
    </Link>
  );
});
