import { FC, memo, useEffect } from 'react';
import { Wrap, WrapItem } from '@chakra-ui/react';
import { axios } from '../../../lib/axios';
import { useAllPendings } from '../hooks/useAllPendings';
import { FriendCard } from './FriendCard';

export const PendingList: FC = memo(() => {
  const { getPendings, pendings, setPendings } = useAllPendings();

  useEffect(() => getPendings(), [getPendings]);

  const onClickAccept = async (index: number) => {
    const newPendings = [...pendings];

    newPendings.splice(index, 1);

    const params = new URLSearchParams();
    params.append('peerId', `${pendings[index].id}`);

    await axios.post('/friendships/accept', params);

    setPendings(newPendings);
  };

  return (
    <Wrap p={{ base: 4, md: 10 }}>
      {pendings.map((obj, index) => (
        <WrapItem key={obj.id} mx="auto">
          <FriendCard
            id={obj.id}
            avatarUrl={obj.avatarUrl}
            name={obj.name}
            button="Accept"
            onClick={async () => await onClickAccept(index)}
          />
        </WrapItem>
      ))}
    </Wrap>
  );
});
