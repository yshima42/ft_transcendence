import { memo, FC } from 'react';
import { Button } from '@chakra-ui/react';
import { useUserBlockCancel } from 'hooks/api';

type Props = {
  targetId: string;
  size?: string;
};

export const UnblockButton: FC<Props> = memo((props) => {
  const { targetId, size = 'sm' } = props;
  const { cancelUserBlock } = useUserBlockCancel(targetId);

  const onClickUnblock = async () => {
    await cancelUserBlock();
  };

  return (
    <Button size={size} onClick={onClickUnblock}>
      Unblock
    </Button>
  );
});
