import { FC, memo } from 'react';
import { AvatarBadge, AvatarProps } from '@chakra-ui/react';
import { useIsFriend, useIsLoginUser } from 'hooks/api';
import { useFriendStatus } from 'hooks/utils/useFriendStatus';
import { LinkedAvatar } from 'components/atoms/avatar/LinkedAvatar';
import { Presence } from 'providers/SocketProvider';

type Props = AvatarProps & {
  id: string;
};

export const UserAvatar: FC<Props> = memo(({ id, ...avatarProps }: Props) => {
  const { isFriend } = useIsFriend(id);
  const { isLoginUser } = useIsLoginUser(id);
  const { presence } = useFriendStatus(id);
  const link = isLoginUser ? `/app/profile` : `/app/users/${id}`;
  const badgeColor =
    presence === Presence.ONLINE
      ? 'green.500'
      : presence === Presence.INGAME
      ? 'red'
      : 'gray';

  return (
    <>
      {isFriend || isLoginUser ? (
        <LinkedAvatar link={link} {...avatarProps}>
          <AvatarBadge boxSize="1.1em" bg={badgeColor} />
        </LinkedAvatar>
      ) : (
        <LinkedAvatar link={link} {...avatarProps} />
      )}
    </>
  );
});
