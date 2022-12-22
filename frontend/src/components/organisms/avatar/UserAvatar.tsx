import { FC, memo } from 'react';
import { AvatarBadge, AvatarProps } from '@chakra-ui/react';
import { useIsFriend, useIsLoginUser } from 'hooks/api';
import { Status, useFriendStatus } from 'hooks/utils/useFriendStatus';
import { LinkedAvatar } from 'components/atoms/avatar/LinkedAvatar';

type Props = AvatarProps & {
  id: string;
};

export const UserAvatar: FC<Props> = memo(({ id, ...avatarProps }: Props) => {
  const { isFriend } = useIsFriend(id);
  const { isLoginUser } = useIsLoginUser(id);
  const { status } = useFriendStatus(id);
  const link = isLoginUser ? `/app/profile` : `/app/users/${id}`;
  const badgeColor =
    status === Status.Online
      ? 'green.500'
      : status === Status.InGame
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
