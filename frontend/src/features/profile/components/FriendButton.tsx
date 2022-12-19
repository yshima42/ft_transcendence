import { memo, FC } from 'react';
import { Box, Button, Flex, HStack } from '@chakra-ui/react';
import {
  useFriendRequest,
  useFriendRequestAccept,
  useFriendRequestCancel,
} from 'hooks/api';
import { FriendRelation } from 'hooks/api/profile/useFriendRelation';
import { useFriendRequestReject } from 'hooks/api/relations/useFriendRequestReject';

type Props = {
  targetId: string;
  friendRelation: FriendRelation;
};

export const FriendButton: FC<Props> = memo((props) => {
  const { targetId, friendRelation } = props;

  const queryKeys = [
    ['friend-relations', { targetId }],
    ['/users/me/friend-requests/outgoing'],
  ];
  const { requestFriend } = useFriendRequest(queryKeys);
  const { cancelFriendRequest } = useFriendRequestCancel(queryKeys);
  const { acceptFriendRequest } = useFriendRequestAccept(queryKeys);
  const { rejectFriendRequest } = useFriendRequestReject(queryKeys);

  const onClickRequestButton = async () => {
    await requestFriend({ receiverId: targetId });
  };

  const onClickCancelButton = async () => {
    await cancelFriendRequest(targetId);
  };

  const onClickAcceptButton = async () => {
    await acceptFriendRequest({
      creatorId: targetId,
    });
  };

  const onClickRejectButton = async () => {
    await rejectFriendRequest(targetId);
  };

  return (
    <Box>
      <Flex justify="center" align="center">
        {friendRelation === 'NONE' ? (
          <Button size="sm" onClick={onClickRequestButton}>
            Request
          </Button>
        ) : friendRelation === 'ACCEPTED' ? (
          <></>
        ) : friendRelation === 'PENDING' ? (
          <Button size="sm" onClick={onClickCancelButton}>
            Cancel
          </Button>
        ) : friendRelation === 'RECOGNITION' ? (
          <HStack>
            <Button size="sm" onClick={onClickAcceptButton}>
              Accept
            </Button>
            <Button size="sm" onClick={onClickRejectButton}>
              Reject
            </Button>
          </HStack>
        ) : (
          <></>
        )}
      </Flex>
    </Box>
  );
});
