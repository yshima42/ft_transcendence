import { memo, FC } from 'react';
import { Button } from '@chakra-ui/react';
import { useFriendRequest } from 'hooks/api';

type Props = {
  targetId: string;
  size?: string;
};

export const RequestButton: FC<Props> = memo((props) => {
  const { targetId, size = 'sm' } = props;
  const { requestFriend, isLoading, isSuccess } = useFriendRequest(targetId);

  const onClickRequest = async () => {
    await requestFriend({ receiverId: targetId });
  };

  return (
    <Button
      size={size}
      isDisabled={isLoading || isSuccess}
      onClick={onClickRequest}
    >
      Request
    </Button>
  );
});
