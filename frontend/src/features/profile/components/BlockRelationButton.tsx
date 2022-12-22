import { memo, FC } from 'react';
import { Box } from '@chakra-ui/react';
import { BlockButton } from 'components/atoms/button/BlockButton';
import { UnblockButton } from 'components/atoms/button/UnblockButton';

type Props = {
  targetId: string;
  isBlockedUser: boolean;
};

export const BlockRelationButton: FC<Props> = memo((props) => {
  const { targetId, isBlockedUser } = props;

  return (
    <Box>
      {isBlockedUser ? (
        <UnblockButton targetId={targetId} />
      ) : (
        <BlockButton targetId={targetId} />
      )}
    </Box>
  );
});
