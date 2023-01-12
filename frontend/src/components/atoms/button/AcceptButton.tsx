import { memo, FC } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { useFriendRequestAccept } from 'hooks/api';

type Props = ButtonProps & {
  targetId: string;
};

export const AcceptButton: FC<Props> = memo((props) => {
  const { targetId, ...buttonProps } = props;
  const { acceptFriendRequest, isLoading, isSuccess } =
    useFriendRequestAccept(targetId);

  const onClickAccept = async () => {
    await acceptFriendRequest({ creatorId: targetId });
  };

  return (
    <Button
      size="sm"
      isDisabled={isLoading || isSuccess}
      onClick={onClickAccept}
      {...buttonProps}
      data-test="accept-button"
    >
      Accept
    </Button>
  );
});
