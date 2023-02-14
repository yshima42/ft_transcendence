import { memo, FC } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { useUserUnblock } from 'hooks/api';

type Props = ButtonProps & {
  targetId: string;
};

export const UnblockButton: FC<Props> = memo((props) => {
  const { targetId, ...buttonProps } = props;
  const { unblockUser, isLoading, isSuccess } = useUserUnblock(targetId);

  const onClickUnblock = async () => {
    await unblockUser();
  };

  return (
    <Button
      size="sm"
      isDisabled={isLoading || isSuccess}
      onClick={onClickUnblock}
      {...buttonProps}
      data-test="unblock-button"
    >
      Message Unblock
    </Button>
  );
});
