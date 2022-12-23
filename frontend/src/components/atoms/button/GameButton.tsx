import { memo, FC } from 'react';
import { Button } from '@chakra-ui/react';

import { User } from '@prisma/client';
import { Link } from 'react-router-dom';

type Props = {
  targetUser: User;
  size?: string;
};

export const GameButton: FC<Props> = memo((props) => {
  const { targetUser, size = 'sm' } = props;

  return (
    <Link to={`/app/inviting/${targetUser.id}`} state={{ user: targetUser }}>
      <Button mr={2} size={size}>
        Game
      </Button>
    </Link>
  );
});
