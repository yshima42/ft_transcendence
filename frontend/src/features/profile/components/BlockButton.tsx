import { memo, FC } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import { useProfileUserBlock } from 'hooks/api/profile/useProfileUserBlock';
import { useProfileUserBlockCancel } from 'hooks/api/profile/useProfileUserBlockCancel';

type BlockButtonProps = {
  userId: string;
  isBlockedUser: boolean;
};

export const BlockButton: FC<BlockButtonProps> = memo(
  ({ userId, isBlockedUser }: BlockButtonProps) => {
    const { blockUserInProfile } = useProfileUserBlock(userId);
    const { cancelUserBlockInProfile } = useProfileUserBlockCancel(userId);

    const onClickBlock = async () => {
      await blockUserInProfile({ targetId: userId });
    };

    const onClickCancelBlock = async () => {
      await cancelUserBlockInProfile(userId);
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
  }
);
