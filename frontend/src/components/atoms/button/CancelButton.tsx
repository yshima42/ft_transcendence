import { memo, FC } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { useFriendRequestCancel } from 'hooks/api';

type Props = ButtonProps & {
  targetId: string;
};

export const CancelButton: FC<Props> = memo((props) => {
  const { targetId, ...buttonProps } = props;
  const { cancelFriendRequest, isLoading, isSuccess } =
    useFriendRequestCancel(targetId);

  const onClickCancel = async () => {
    await cancelFriendRequest();
  };

  return (
    <Button
      size="sm"
      isDisabled={isLoading || isSuccess}
      onClick={onClickCancel}
      {...buttonProps}
      data-test="cancel-button"
    >
      Cancel
    </Button>
  );
});
