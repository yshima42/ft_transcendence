import { FC, memo, useEffect } from 'react';
import { Wrap, WrapItem } from '@chakra-ui/react';
import { axios } from '../../../lib/axios';
import { useAllRequests } from '../hooks/useAllRequests';
import { FriendCard } from './FriendCard';

export const RequestList: FC = memo(() => {
  const { getRequests, requests, setRequests } = useAllRequests();
  useEffect(() => getRequests(), [getRequests]);

  const onClickCancel = async (index: number) => {
    const newRequests = [...requests];
    newRequests.splice(index, 1);

    await axios.delete('/friendships/cancel', {
      data: { peerId: requests[index].id },
    });

    setRequests(newRequests);
  };

  return (
    <Wrap p={{ base: 4, md: 10 }}>
      {requests.map((obj, index) => (
        <WrapItem key={obj.id} mx="auto">
          <FriendCard
            id={obj.id}
            avatarUrl={obj.avatarUrl}
            name={obj.name}
            button="Cancel"
            onClick={async () => await onClickCancel(index)}
          />
        </WrapItem>
      ))}
    </Wrap>
  );
});
