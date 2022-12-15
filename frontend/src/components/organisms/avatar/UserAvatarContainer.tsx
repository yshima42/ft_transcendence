import { FC, memo } from 'react';
import { AvatarProps } from '@chakra-ui/react';
import { useFriends, useProfile } from 'hooks/api';
import { UserAvatar } from './UserAvatar';
import { UserAvatarWithBadge } from './UserAvatarWithBadge';

type Props = AvatarProps & {
  id: string;
};

export const UserAvatarContainer: FC<Props> = memo((props) => {
  const { id, ...avatarProps } = props;
  const { users: friends } = useFriends();
  const { user } = useProfile();
  const isFriend = friends.find((friend) => friend.id === id) !== undefined;
  const isLoginUser = id === user.id;
  const link = `/app/users/${id}`;

  return (
    <>
      {isFriend || isLoginUser ? (
        <UserAvatarWithBadge id={id} link={link} {...avatarProps} />
      ) : (
        <UserAvatar link={link} {...avatarProps} />
      )}
    </>
  );
});
