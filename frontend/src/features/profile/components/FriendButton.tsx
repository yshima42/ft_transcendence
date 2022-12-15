import { memo, FC } from 'react';
import { Box, Button, Flex, HStack } from '@chakra-ui/react';
import { useFriendRelation } from 'hooks/api/profile/useFriendRelation';
import { useProfileFriendRequest } from 'hooks/api/profile/useProfileFriendRequest';
import { useProfileFriendRequestAccept } from 'hooks/api/profile/useProfileFriendRequestAccept';
import { useProfileFriendRequestCancel } from 'hooks/api/profile/useProfileFriendRequestCancel';
import { useProfileFriendRequestReject } from 'hooks/api/profile/useProfileFriendRequestReject';

type Props = {
  otherId: string;
};

export const FriendButton: FC<Props> = memo((props) => {
  const { otherId } = props;
  const { friendRelation } = useFriendRelation(otherId);
  const { requestFriendInProfile } = useProfileFriendRequest(otherId);
  const { cancelFriendRequestInProfile } =
    useProfileFriendRequestCancel(otherId);
  const { acceptFriendRequestInProfile } =
    useProfileFriendRequestAccept(otherId);
  const { rejectFriendRequestInProfile } =
    useProfileFriendRequestReject(otherId);

  const onClickRequestButton = async () => {
    await requestFriendInProfile({ receiverId: otherId });
  };

  const onClickCancelButton = async () => {
    await cancelFriendRequestInProfile(otherId);
  };

  const onClickAcceptButton = async () => {
    await acceptFriendRequestInProfile({
      creatorId: otherId,
    });
  };

  const onClickRejectButton = async () => {
    await rejectFriendRequestInProfile(otherId);
  };

  return (
    <Box h="80px">
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
