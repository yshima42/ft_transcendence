import { FC, memo } from 'react';
import { AvatarBadge, AvatarProps } from '@chakra-ui/react';
import { useFriendStatus } from 'hooks/utils/useFriendStatus';
import { useIsFrind } from 'hooks/utils/useIsFriend';
import { useIsLoginUser } from 'hooks/utils/useIsLoginUser';
import { LinkedAvatar } from 'components/atoms/avatar/LinkedAvatar';

type Props = AvatarProps & {
  id: string;
};

export const UserAvatar: FC<Props> = memo(({ id, ...avatarProps }: Props) => {
  const { isFriend } = useIsFrind(id);
  const { isLoginUser } = useIsLoginUser(id);
  const { isOnline } = useFriendStatus(id);
  const link = isLoginUser ? `/app/profile` : `/app/users/${id}`;
  const badgeColor = isOnline ? 'green.500' : 'gray';

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
