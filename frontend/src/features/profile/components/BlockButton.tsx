import { memo, FC } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import { useUserBlock, useUserBlockCancel } from 'hooks/api';

type BlockButtonProps = {
  userId: string;
  isBlockedUser: boolean;
};

export const BlockButton: FC<BlockButtonProps> = memo(
  ({ userId, isBlockedUser }: BlockButtonProps) => {
    const { blockUser } = useUserBlock();
    const { cancelUserBlock } = useUserBlockCancel();

    const onClickBlock = async () => {
      await blockUser({ targetId: userId });
    };

    const onClickCancelBlock = async () => {
      await cancelUserBlock(userId);
    };

    return (
      <Box h="80px">
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
  }
);
