import { memo, FC } from 'react';
import { HStack } from '@chakra-ui/react';
import { FriendRelation } from 'hooks/api/friend/useFriendRelation';
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
    <>
      {friendRelation === 'NONE' ? (
        <RequestButton targetId={targetId} />
      ) : friendRelation === 'ACCEPTED' ? (
        <></>
      ) : friendRelation === 'PENDING' ? (
        <CancelButton targetId={targetId} />
      ) : (
        <HStack>
          <AcceptButton targetId={targetId} />
          <RejectButton targetId={targetId} />
        </HStack>
      )}
    </>
  );
});
