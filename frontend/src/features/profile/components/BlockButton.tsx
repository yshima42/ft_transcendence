import { memo, FC } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useUserBlock, useUserBlockCancel } from 'hooks/api';

type BlockButtonProps = {
  userId: string;
  isBlockedUser: boolean;
};

export const BlockButton: FC<BlockButtonProps> = memo(
  ({ userId, isBlockedUser }: BlockButtonProps) => {
    const { blockUser } = useUserBlock();
    const { cancelUserBlock } = useUserBlockCancel();
    const queryClient = useQueryClient();

    const onClickBlock = async () => {
      await blockUser({ targetId: userId });
      void queryClient.invalidateQueries(['/users/me/blocks']);
    };

    const onClickCancelBlock = async () => {
      await cancelUserBlock(userId);
      void queryClient.invalidateQueries(['/users/me/blocks']);
    };

    return (
      <Box h="80px">
        <Flex justify="center" align="center">
          <Button
            mx={8}
            onClick={isBlockedUser ? onClickCancelBlock : onClickBlock}
          >
            {isBlockedUser ? 'unblock' : 'block'}
          </Button>
        </Flex>
      </Box>
    );
  }
);
