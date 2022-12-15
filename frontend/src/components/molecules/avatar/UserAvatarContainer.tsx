import { FC, memo } from 'react';
import { AvatarProps } from '@chakra-ui/react';
import { useFriends } from 'hooks/api';
import { FriendAvatar } from './FriendAvatar';
import { UserAvatar } from './UserAvatar';

type Props = AvatarProps & {
  id: string;
  src: string;
};

export const UserAvatarContainser: FC<Props> = memo((props) => {
  const { id, src, ...avatarProps } = props;
  const { users: friends } = useFriends();
  const isFriend = friends.find((friend) => friend.id === id) !== undefined;

  return (
    <>
      {isFriend && <FriendAvatar id={id} src={src} {...avatarProps} />}
      {!isFriend && <UserAvatar id={id} src={src} />}
    </>
  );
});
