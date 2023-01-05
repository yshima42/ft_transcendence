import { memo, FC } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { useFriendRequest } from 'hooks/api';

type Props = ButtonProps & {
  targetId: string;
};

export const RequestButton: FC<Props> = memo((props) => {
  const { targetId, ...buttonProps } = props;
  const { requestFriend, isLoading, isSuccess } = useFriendRequest(targetId);

  const onClickRequest = async () => {
    await requestFriend({ receiverId: targetId });
  };

  return (
    <Button
      size="sm"
      isDisabled={isLoading || isSuccess}
      onClick={onClickRequest}
      {...buttonProps}
    >
      Request
    </Button>
  );
});
