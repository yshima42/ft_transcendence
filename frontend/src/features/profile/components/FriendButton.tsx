import { memo, FC } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import {
  useFriendRequest,
  useFriendRequestRespond,
  useFriendUnregister,
} from 'hooks/api';
import { useFriendRelation } from 'hooks/api/relations/useFriendRelation';

type Props = {
  otherId: string;
};

export const FriendButton: FC<Props> = memo((props) => {
  const { otherId } = props;
  const { friendRelation } = useFriendRelation(otherId);
  const { requestFriend } = useFriendRequest();
  const { unregisterFriend } = useFriendUnregister(otherId);
  const { respondFriendRequest } = useFriendRequestRespond();

  const onClickRequestButton = async () => {
    await requestFriend({ receiverId: otherId });
  };

  const onClickUnfriendButton = async () => {
    await unregisterFriend();
  };

  const onClickAcceptButton = async () => {
    await respondFriendRequest({ creatorId: otherId, status: 'ACCEPTED' });
  };

  return (
    <Box h="80px">
      <Flex justify="center" align="center">
        {friendRelation === 'NONE' ? (
          <Button onClick={onClickRequestButton}>Request</Button>
        ) : friendRelation === 'ACCEPTED' ? (
          <Button onClick={onClickUnfriendButton}>Unfriend</Button>
        ) : friendRelation === 'PENDING' ? (
          <Button>Cancel</Button>
        ) : friendRelation === 'RECOGNITION' ? (
          <Button onClick={onClickAcceptButton}>Accept</Button>
        ) : (
          <></>
        )}
      </Flex>
    </Box>
  );
});
