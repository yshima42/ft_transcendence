import { memo, FC } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { useUserBlock } from 'hooks/api';

type Props = ButtonProps & {
  targetId: string;
};

export const BlockButton: FC<Props> = memo((props) => {
  const { targetId, ...buttonProps } = props;
  const { blockUser, isLoading, isSuccess } = useUserBlock(targetId);

  const onClickUnblock = async () => {
    await blockUser({ targetId });
  };

  return (
    <Button
      size="sm"
      isDisabled={isLoading || isSuccess}
      onClick={onClickUnblock}
      {...buttonProps}
      data-test="block-button"
    >
      Message Block
    </Button>
  );
});
