import { memo, FC } from 'react';
import { Button } from '@chakra-ui/react';
import { useFriendRequestReject } from 'hooks/api/friend/useFriendRequestReject';

type Props = {
  targetId: string;
  size?: string;
};

export const RejectButton: FC<Props> = memo((props) => {
  const { targetId, size = 'sm' } = props;
  const { rejectFriendRequest, isLoading } = useFriendRequestReject(targetId);

  const onClickReject = async () => {
    await rejectFriendRequest();
  };

  return (
    <Button size={size} isDisabled={isLoading} onClick={onClickReject}>
      Reject
    </Button>
  );
});
