import { memo, FC } from 'react';
import { Button, ButtonProps, HStack } from '@chakra-ui/react';
import { useFriendRequestAccept, useFriendRequestReject } from 'hooks/api';

type Props = ButtonProps & {
  targetId: string;
};

export const AcceptAndRejectButton: FC<Props> = memo((props) => {
  const { targetId, ...buttonProps } = props;
  const {
    acceptFriendRequest,
    isLoading: isLoadingAccept,
    isSuccess: isSuccessAccept,
  } = useFriendRequestAccept(targetId);

  const {
    rejectFriendRequest,
    isLoading: isLoadingReject,
    isSuccess: isSuccessReject,
  } = useFriendRequestReject(targetId);

  const onClickAccept = async () => {
    await acceptFriendRequest({ creatorId: targetId });
  };

  const onClickReject = async () => {
    await rejectFriendRequest();
  };

  return (
    <HStack>
      <Button
        size="sm"
        isDisabled={
          isLoadingAccept ||
          isSuccessAccept ||
          isLoadingReject ||
          isSuccessReject
        }
        onClick={onClickAccept}
        {...buttonProps}
        data-test="accept-button"
      >
        Accept
      </Button>
      <Button
        size="sm"
        isDisabled={
          isLoadingAccept ||
          isSuccessAccept ||
          isLoadingReject ||
          isSuccessReject
        }
        onClick={onClickReject}
        {...buttonProps}
        data-test="reject-button"
      >
        Reject
      </Button>
    </HStack>
  );
});
