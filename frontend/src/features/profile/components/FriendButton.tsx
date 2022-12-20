import { memo, FC } from 'react';
import { Box, Flex, HStack } from '@chakra-ui/react';
import { FriendRelation } from 'hooks/api/profile/useFriendRelation';
import { AcceptButton } from 'components/atoms/button/AcceptButton';
import { CancelButton } from 'components/atoms/button/CancelButton';
import { RejectButton } from 'components/atoms/button/RejectButton';
import { RequestButton } from 'components/atoms/button/RequestButton';

type Props = {
  targetId: string;
  friendRelation: FriendRelation;
};

export const FriendButton: FC<Props> = memo((props) => {
  const { targetId, friendRelation } = props;

  return (
    <Box>
      <Flex justify="center" align="center">
        {friendRelation === 'NONE' ? (
          <RequestButton targetId={targetId} />
        ) : friendRelation === 'ACCEPTED' ? (
          <></>
        ) : friendRelation === 'PENDING' ? (
          <CancelButton targetId={targetId} />
        ) : friendRelation === 'RECOGNITION' ? (
          <HStack>
            <AcceptButton targetId={targetId} />
            <RejectButton targetId={targetId} />
          </HStack>
        ) : (
          <></>
        )}
      </Flex>
    </Box>
  );
});
