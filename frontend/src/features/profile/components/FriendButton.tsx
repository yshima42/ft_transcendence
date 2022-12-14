import { memo, FC } from 'react';
import { Box, Button, Flex, HStack } from '@chakra-ui/react';
import { useFriendRelation } from 'hooks/api/relations/useFriendRelation';
import { useFriendRequestCancelInProfile } from 'hooks/api/relations/useFriendRequestCancelInProfile';
import { useFriendRequestInProfile } from 'hooks/api/relations/useFriendRequestInProfile';
import { useFriendRequestRespondInProfile } from 'hooks/api/relations/useFriendRequestRespondInProfile';
// import { useFriendUnregisterInProfile } from 'hooks/api/relations/useFriendUnregisterInProfile';

type Props = {
  otherId: string;
};

export const FriendButton: FC<Props> = memo((props) => {
  const { otherId } = props;
  const { friendRelation } = useFriendRelation(otherId);
  const { requestFriendInProfile } = useFriendRequestInProfile(otherId);
  // const { unregisterFriendInProfile } = useFriendUnregisterInProfile(otherId);
  const { cancelFriendRequestInProfile } =
    useFriendRequestCancelInProfile(otherId);
  const { respondFriendRequestInProfile } =
    useFriendRequestRespondInProfile(otherId);

  const onClickRequestButton = async () => {
    await requestFriendInProfile({ receiverId: otherId });
  };

  // const onClickUnfriendButton = async () => {
  //   await unregisterFriendInProfile();
  // };

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
    await respondFriendRequestInProfile({
      creatorId: otherId,
      status: 'DECLINED',
    });
  };

  return (
    <Box h="80px">
      <Flex justify="center" align="center">
        {friendRelation === 'NONE' ? (
          <Button onClick={onClickRequestButton}>Request</Button>
        ) : friendRelation === 'ACCEPTED' ? (
          // <Button onClick={onClickUnfriendButton}>Unfriend</Button>
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
