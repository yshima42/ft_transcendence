import { memo, FC } from 'react';
import { Box, Button, Flex, HStack } from '@chakra-ui/react';
import { useFriendRelation } from 'hooks/api/relations/useFriendRelation';
import { useFriendRequestCancelInProfile } from 'hooks/api/relations/useFriendRequestCancelInProfile';
import { useFriendRequestInProfile } from 'hooks/api/relations/useFriendRequestInProfile';
import { useFriendRequestRejectInProfile } from 'hooks/api/relations/useFriendRequestReject';
import { useFriendRequestRespondInProfile } from 'hooks/api/relations/useFriendRequestRespondInProfile';

type Props = {
  otherId: string;
};

export const FriendButton: FC<Props> = memo((props) => {
  const { otherId } = props;
  const { friendRelation } = useFriendRelation(otherId);
  const { requestFriendInProfile } = useFriendRequestInProfile(otherId);
  const { cancelFriendRequestInProfile } =
    useFriendRequestCancelInProfile(otherId);
  const { respondFriendRequestInProfile } =
    useFriendRequestRespondInProfile(otherId);
  const { rejectFriendRequestInProfile } =
    useFriendRequestRejectInProfile(otherId);

  const onClickRequestButton = async () => {
    await requestFriendInProfile({ receiverId: otherId });
  };

  const onClickCancelButton = async () => {
    await cancelFriendRequestInProfile(otherId);
  };

  const onClickAcceptButton = async () => {
    await respondFriendRequestInProfile({
      creatorId: otherId,
      status: 'ACCEPTED',
    });
  };

  const onClickRejectButton = async () => {
    await rejectFriendRequestInProfile(otherId);
  };

  return (
    <Box h="80px">
      <Flex justify="center" align="center">
        {friendRelation === 'NONE' ? (
          <Button onClick={onClickRequestButton}>Request</Button>
        ) : friendRelation === 'ACCEPTED' ? (
          <></>
        ) : friendRelation === 'PENDING' ? (
          <Button onClick={onClickCancelButton}>Cancel</Button>
        ) : friendRelation === 'RECOGNITION' ? (
          <HStack>
            <Button onClick={onClickAcceptButton}>Accept</Button>
            <Button onClick={onClickRejectButton}>Reject</Button>
          </HStack>
        ) : (
          <></>
        )}
      </Flex>
    </Box>
  );
});
