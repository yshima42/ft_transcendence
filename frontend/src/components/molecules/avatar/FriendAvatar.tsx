import { FC, memo } from 'react';
import { AvatarBadge, AvatarProps } from '@chakra-ui/react';
import { useFriendStatus } from 'hooks/utils/useFriendStatus';
import { LinkedAvatar } from 'components/atoms/avatar/LinkedAvatar';

type Props = AvatarProps & {
  id: string;
  src: string;
};

export const FriendAvatar: FC<Props> = memo((props) => {
  const { id, src, ...avatarProps } = props;
  const { isOnline } = useFriendStatus(id);
  const badgeColor = isOnline ? 'green.500' : 'gray';

  return (
    <LinkedAvatar src={src} linkUrl={`/app/users/${id}`} {...avatarProps}>
      <AvatarBadge boxSize="1.1em" bg={badgeColor} />
    </LinkedAvatar>
  );
});
