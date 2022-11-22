import { FC, memo, useEffect } from 'react';
import { Wrap, WrapItem } from '@chakra-ui/react';
import { useAllRequests } from '../hooks/useAllRequests';
import { FriendCard } from './FriendCard';

export const RequestList: FC = memo(() => {
  const { getRequests, requests } = useAllRequests();
  useEffect(() => getRequests(), [getRequests]);

  const onClickCancel = () => {
    alert('onClickCancel');
  };

  return (
    <Wrap p={{ base: 4, md: 10 }}>
      {requests.map((obj) => (
        <WrapItem key={obj.id} mx="auto">
          <FriendCard
            id={obj.id}
            avatarUrl={obj.avatarUrl}
            name={obj.name}
            button="Cancel"
            onClick={onClickCancel}
          />
        </WrapItem>
      ))}
    </Wrap>
  );
});
