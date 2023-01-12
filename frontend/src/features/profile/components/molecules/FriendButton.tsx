import { memo, FC } from 'react';
import { FriendRelation } from 'hooks/api/friend/useFriendRelation';
import { CancelButton } from 'components/atoms/button/CancelButton';
import { RequestButton } from 'components/atoms/button/RequestButton';
import { AcceptAndRejectButton } from 'components/molecules/AcceptAndRejectButton';

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
        <AcceptAndRejectButton targetId={targetId} />
      )}
    </>
  );
});
