import { FC, memo } from 'react';
import { AvatarBadge, AvatarProps } from '@chakra-ui/react';
import { useFriendStatus } from 'hooks/utils/useFriendStatus';
import { LinkedAvatar } from 'components/atoms/avatar/LinkedAvatar';

type Props = AvatarProps & {
  id: string;
  link: string;
};

export const UserAvatarWithBadge: FC<Props> = memo((props) => {
  const { id, link, ...avatarProps } = props;
  const { isOnline } = useFriendStatus(id);
  const badgeColor = isOnline ? 'green.500' : 'gray';

  return (
    <LinkedAvatar link={link} {...avatarProps}>
      <AvatarBadge boxSize="1.1em" bg={badgeColor} />
    </LinkedAvatar>
  );
});
