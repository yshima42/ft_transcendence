import { memo, FC } from 'react';
import { Button } from '@chakra-ui/react';
import { useUserBlock } from 'hooks/api';

type Props = {
  targetId: string;
  size?: string;
};

export const BlockButton: FC<Props> = memo((props) => {
  const { targetId, size = 'sm' } = props;
  const { blockUser, isLoading } = useUserBlock(targetId);

  const onClickUnblock = async () => {
    await blockUser({ targetId });
  };

  return (
    <Button
      size={size}
      isLoading={isLoading}
      isDisabled={isLoading}
      onClick={onClickUnblock}
    >
      Block
    </Button>
  );
});
