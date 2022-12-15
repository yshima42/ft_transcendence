import { FC, memo } from 'react';
import { AvatarProps } from '@chakra-ui/react';
import { useFriends, useProfile } from 'hooks/api';
import { UserAvatar } from './UserAvatar';
import { UserAvatarWithBadge } from './UserAvatarWithBadge';

type Props = AvatarProps & {
  id: string;
  src: string;
};

export const UserAvatarContainer: FC<Props> = memo((props) => {
  const { id, src, ...avatarProps } = props;
  const { users: friends } = useFriends();
  const { user } = useProfile();
  const isFriend = friends.find((friend) => friend.id === id) !== undefined;
  const isLoginUser = id === user.id;

  return (
    <>
      {isFriend || isLoginUser ? (
        <UserAvatarWithBadge id={id} src={src} {...avatarProps} />
      ) : (
        <UserAvatar id={id} src={src} {...avatarProps} />
      )}
    </>
  );
});
