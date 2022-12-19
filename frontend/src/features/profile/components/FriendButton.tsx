import { memo, FC } from 'react';
import { Box, Button, Flex, HStack } from '@chakra-ui/react';
import {
  useFriendRequest,
  useFriendRequestAccept,
  useFriendRequestCancel,
} from 'hooks/api';
import { useFriendRelation } from 'hooks/api/profile/useFriendRelation';
import { useFriendRequestReject } from 'hooks/api/relations/useFriendRequestReject';

type Props = {
  userId: string;
};

export const FriendButton: FC<Props> = memo((props) => {
  const { userId } = props;

  const { friendRelation } = useFriendRelation(userId);

  const queryKeys = [
    ['friend-relations', { userId }],
    ['/users/me/friend-requests/outgoing'],
  ];
  const { requestFriend } = useFriendRequest(queryKeys);
  const { cancelFriendRequest } = useFriendRequestCancel(queryKeys);
  const { acceptFriendRequest } = useFriendRequestAccept(queryKeys);
  const { rejectFriendRequest } = useFriendRequestReject(queryKeys);

  const onClickRequestButton = async () => {
    await requestFriend({ receiverId: userId });
  };

  const onClickCancelButton = async () => {
    await cancelFriendRequest(userId);
  };

  const onClickAcceptButton = async () => {
    await acceptFriendRequest({
      creatorId: userId,
    });
  };

  const onClickRejectButton = async () => {
    await rejectFriendRequest(userId);
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
