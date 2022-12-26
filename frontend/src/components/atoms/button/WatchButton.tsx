import { memo, FC } from 'react';
import { Button } from '@chakra-ui/react';

import { Link } from 'react-router-dom';

type Props = {
  gameRoomId: string;
  size?: string;
};

export const WatchButton: FC<Props> = memo((props) => {
  const { gameRoomId, size = 'sm' } = props;

  return (
    <Link to={`/app/games/${gameRoomId}`}>
      <Button mr={2} size={size}>
        Watch
      </Button>
    </Link>
  );
});
