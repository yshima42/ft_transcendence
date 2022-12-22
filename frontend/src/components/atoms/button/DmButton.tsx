import { memo, FC } from 'react';
import { Button } from '@chakra-ui/react';

type Props = {
  targetId: string;
  size?: string;
};

export const DmButton: FC<Props> = memo((props) => {
  const { targetId, size = 'sm' } = props;

  const onClickDm = () => {
    alert(`DM to ${targetId}`);
  };

  return (
    <Button size={size} onClick={onClickDm}>
      DM
    </Button>
  );
});
