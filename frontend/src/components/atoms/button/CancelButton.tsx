import { memo, FC } from 'react';
import { Button } from '@chakra-ui/react';
import { useFriendRequestCancel } from 'hooks/api';

type Props = {
  targetId: string;
  size?: string;
};

export const CancelButton: FC<Props> = memo((props) => {
  const { targetId, size = 'sm' } = props;
  const { cancelFriendRequest } = useFriendRequestCancel(targetId);

  const onClickCancel = async () => {
    await cancelFriendRequest();
  };

  return (
    <Button size={size} onClick={onClickCancel}>
      Cancel
    </Button>
  );
});
