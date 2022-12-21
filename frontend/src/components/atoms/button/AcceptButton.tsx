import { memo, FC } from 'react';
import { Button, Spinner } from '@chakra-ui/react';
import { useFriendRequestAccept } from 'hooks/api';

type Props = {
  targetId: string;
  size?: string;
};

export const AcceptButton: FC<Props> = memo((props) => {
  const { targetId, size = 'sm' } = props;
  const { acceptFriendRequest, isLoading } = useFriendRequestAccept(targetId);

  const onClickAccept = async () => {
    await acceptFriendRequest({ creatorId: targetId });
  };

  return (
    <Button size={size} onClick={onClickAccept}>
      {isLoading ? <Spinner /> : 'Accept'}
    </Button>
  );
});
