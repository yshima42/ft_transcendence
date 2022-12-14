import { FC, memo, useContext } from 'react';
import { AvatarBadge } from '@chakra-ui/react';
import { LinkedAvatar } from 'components/atoms/avatar/LinkedAvatar';
import SocketContext from 'contexts/SocketContext';

type Props = {
  id: string;
  src: string;
};

export const FriendAvatar: FC<Props> = memo((props) => {
  const { id, src } = props;
  const { users: onlineUsers } = useContext(SocketContext).SocketState;
  console.info(onlineUsers);
  // const isOnline =
  //   onlineUsers.find((onlineUserId) => onlineUserId === id) !== undefined;
  const isOnline = onlineUsers.length > 1;
  const badgeColor = isOnline ? 'green.500' : 'gray';

  return (
    <LinkedAvatar size="lg" src={src} linkUrl={`/app/users/${id}`}>
      <AvatarBadge boxSize="1.1em" bg={badgeColor} />
    </LinkedAvatar>
  );
});
