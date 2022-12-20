import { memo, FC } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import { useUserBlockCancel } from 'hooks/api';

type Props = {
  targetId: string;
};

export const BlockButton: FC<Props> = memo((props) => {
  const { targetId } = props;
  const { cancelUserBlock } = useUserBlockCancel(targetId);

  const onClickBlock = async () => {
    await cancelUserBlock();
  };

  return (
    <Box>
      <Flex justify="center" align="center">
        <Button size="sm" onClick={onClickBlock}>
          Unblock
        </Button>
      </Flex>
    </Box>
  );
});
