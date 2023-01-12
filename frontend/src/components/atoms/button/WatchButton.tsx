import { memo, FC } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

import { Link } from 'react-router-dom';

type Props = ButtonProps & {
  gameRoomId: string;
  isPlayer: boolean;
};

export const WatchButton: FC<Props> = memo((props) => {
  const { gameRoomId, isPlayer, ...buttonProps } = props;

  return (
    <Link to={`/app/game/rooms/${gameRoomId}`}>
      <Button mr={2} size="sm" {...buttonProps}>
        {isPlayer ? 'Reconnect' : 'Watch'}
      </Button>
    </Link>
  );
});
