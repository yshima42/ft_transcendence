import { FC, memo } from 'react';
import { AvatarBadge } from '@chakra-ui/react';
import { useFriendStatus } from 'hooks/utils/useFriendStatus';
import { LinkedAvatar } from 'components/atoms/avatar/LinkedAvatar';

type Props = {
  id: string;
  src: string;
};

export const FriendAvatar: FC<Props> = memo((props) => {
  const { id, src } = props;
  const { isOnline } = useFriendStatus(id);
  const badgeColor = isOnline ? 'green.500' : 'gray';

  return (
    <LinkedAvatar size="lg" src={src} linkUrl={`/app/users/${id}`}>
      <AvatarBadge boxSize="1.1em" bg={badgeColor} />
    </LinkedAvatar>
  );
});
