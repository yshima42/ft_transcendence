import { memo, FC } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import { useFriendRelation } from 'hooks/api/relations/useFriendRelation';
import { useFriendRequestInProfile } from 'hooks/api/relations/useFriendRequestInProfile';
import { useFriendRequestRespondInProfile } from 'hooks/api/relations/useFriendRequestRespondInProfile';
import { useFriendUnregisterInProfile } from 'hooks/api/relations/useFriendUnregisterInProfile';

type Props = {
  otherId: string;
};

export const FriendButton: FC<Props> = memo((props) => {
  const { otherId } = props;
  const { friendRelation } = useFriendRelation(otherId);
  const { requestFriendInProfile } = useFriendRequestInProfile(otherId);
  const { unregisterFriendInProfile } = useFriendUnregisterInProfile(otherId);
  const { respondFriendRequestInProfile } =
    useFriendRequestRespondInProfile(otherId);

  const onClickRequestButton = async () => {
    await requestFriendInProfile({ receiverId: otherId });
  };

  const onClickUnfriendButton = async () => {
    await unregisterFriendInProfile();
  };

  const onClickCancelButton = () => {
    alert('test');
  };

  const onClickAcceptButton = async () => {
    await respondFriendRequestInProfile({
      creatorId: otherId,
      status: 'ACCEPTED',
    });
  };

  return (
    <Box h="80px">
      <Flex justify="center" align="center">
        {friendRelation === 'NONE' ? (
          <Button onClick={onClickRequestButton}>Request</Button>
        ) : friendRelation === 'ACCEPTED' ? (
          <Button onClick={onClickUnfriendButton}>Unfriend</Button>
        ) : friendRelation === 'PENDING' ? (
          <Button onClick={onClickCancelButton}>Cancel</Button>
        ) : friendRelation === 'RECOGNITION' ? (
          <Button onClick={onClickAcceptButton}>Accept</Button>
        ) : (
          <></>
        )}
      </Flex>
    </Box>
  );
});
