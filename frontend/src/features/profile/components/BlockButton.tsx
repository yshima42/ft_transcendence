import { memo, FC } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import { useUserBlock, useUserBlockCancel } from 'hooks/api';

type Props = {
  targetId: string;
  isBlockedUser: boolean;
};

export const BlockButton: FC<Props> = memo((props) => {
  const { targetId, isBlockedUser } = props;

  const { blockUser } = useUserBlock(targetId);
  const { cancelUserBlock } = useUserBlockCancel(targetId);

  const onClickBlock = async () => {
    await blockUser({ targetId });
  };

  const onClickCancelBlock = async () => {
    await cancelUserBlock();
  };

  return (
    <Box>
      <Flex justify="center" align="center">
        <Button
          size="sm"
          onClick={isBlockedUser ? onClickCancelBlock : onClickBlock}
        >
          {isBlockedUser ? 'unblock' : 'block'}
        </Button>
      </Flex>
    </Box>
  );
});
