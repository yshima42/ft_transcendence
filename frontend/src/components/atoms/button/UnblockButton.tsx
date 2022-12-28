import { memo, FC } from 'react';
import { Button } from '@chakra-ui/react';
import { useUserUnblock } from 'hooks/api';

type Props = {
  targetId: string;
  size?: string;
};

export const UnblockButton: FC<Props> = memo((props) => {
  const { targetId, size = 'sm' } = props;
  const { unblockUser, isLoading, isSuccess } = useUserUnblock(targetId);

  const onClickUnblock = async () => {
    await unblockUser();
  };

  return (
    <Button
      size={size}
      isDisabled={isLoading || isSuccess}
      onClick={onClickUnblock}
    >
      Unblock
    </Button>
  );
});
