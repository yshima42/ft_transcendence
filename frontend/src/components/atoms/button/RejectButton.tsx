import { memo, FC } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { useFriendRequestReject } from 'hooks/api/friend/useFriendRequestReject';

type Props = ButtonProps & {
  targetId: string;
};

export const RejectButton: FC<Props> = memo((props) => {
  const { targetId, ...buttonProps } = props;
  const { rejectFriendRequest, isLoading, isSuccess } =
    useFriendRequestReject(targetId);

  const onClickReject = async () => {
    await rejectFriendRequest();
  };

  return (
    <Button
      size="sm"
      isDisabled={isLoading || isSuccess}
      onClick={onClickReject}
      {...buttonProps}
    >
      Reject
    </Button>
  );
});
