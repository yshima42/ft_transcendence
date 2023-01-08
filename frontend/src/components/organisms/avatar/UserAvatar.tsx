import { FC, memo } from 'react';
import { AvatarBadge, AvatarProps } from '@chakra-ui/react';
import { useUserPresence } from 'hooks/utils/useUserPresence';
import { LinkedAvatar } from 'components/atoms/avatar/LinkedAvatar';
import { Presence } from 'providers/SocketProvider';

type Props = AvatarProps & {
  id: string;
  dataTestProp?: string;
};

export const UserAvatar: FC<Props> = memo(
  ({ id, dataTestProp, ...avatarProps }: Props) => {
    const { presence } = useUserPresence(id);
    const badgeColor =
      presence === Presence.ONLINE
        ? 'green.500'
        : presence === Presence.INGAME
        ? 'red'
        : 'gray';

    return (
      <>
        <LinkedAvatar
          link={`/app/users/${id}`}
          dataTestProp={dataTestProp}
          {...avatarProps}
        >
          <AvatarBadge boxSize="1.1em" bg={badgeColor} />
        </LinkedAvatar>
      </>
    );
  }
);
