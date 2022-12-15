import { FC, memo } from 'react';
import { AvatarProps } from '@chakra-ui/react';
import { useIsFrind } from 'hooks/utils/useIsFriend';
import { useIsLoginUser } from 'hooks/utils/useIsLoginUser';
import { UserAvatar } from './UserAvatar';
import { UserAvatarWithBadge } from './UserAvatarWithBadge';

type Props = AvatarProps & {
  id: string;
};

export const UserAvatarContainer: FC<Props> = memo(
  ({ id, ...avatarProps }: Props) => {
    const { isFriend } = useIsFrind(id);
    const { isLoginUser } = useIsLoginUser(id);
    const link = `/app/users/${id}`;

    return (
      <>
        {isFriend || isLoginUser ? (
          <UserAvatarWithBadge
            id={id}
            link={`/app/users/${id}`}
            {...avatarProps}
          />
        ) : (
          <UserAvatar link={link} {...avatarProps} />
        )}
      </>
    );
  }
);
