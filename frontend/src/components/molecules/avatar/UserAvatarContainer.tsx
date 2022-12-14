import { FC, memo } from 'react';
import { useFriends } from 'hooks/api';
import { FriendAvatar } from './FriendAvatar';
import { UserAvatar } from './UserAvatar';

type Props = {
  id: string;
  src: string;
};

export const UserAvatarContainser: FC<Props> = memo((props) => {
  const { id, src } = props;
  const { users: friends } = useFriends();
  const isFriend = friends.find((friend) => friend.id === id) !== undefined;

  return (
    <>
      {isFriend && <FriendAvatar id={id} src={src} />}
      {!isFriend && <UserAvatar id={id} src={src} />}
    </>
  );
});
