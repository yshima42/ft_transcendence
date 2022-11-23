import { ChangeEvent, FC, memo, useState } from 'react';
import { Box, HStack, Input, Spacer, Wrap, WrapItem } from '@chakra-ui/react';
import { PrimaryButton } from 'components/button/PrimaryButton';
import { axios } from '../../../lib/axios';
import { useAllUsers } from '../hooks/useAllUsers';
import { FriendCard } from './FriendCard';

export const UserSearch: FC = memo(() => {
  const [input, setInput] = useState('');

  const { getUsers, users, setUsers } = useAllUsers();

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) =>
    setInput(e.target.value);

  const onClickSearch = () => {
    getUsers();
  };

  const onClickAdd = async (index: number) => {
    const newUsers = [...users];

    newUsers.splice(index, 1);
    const params = new URLSearchParams();
    params.append('peerId', `${users[index].id}`);

    await axios.post('/friendships/request', params);

    setUsers(newUsers);
  };

  return (
    <>
      <Box w={400} mt={4}>
        <HStack>
          <Input
            placeholder="Input user name"
            value={input}
            onChange={onChangeInput}
          />
          <Spacer />
          <PrimaryButton onClick={onClickSearch}>Search</PrimaryButton>
        </HStack>
      </Box>

      <Wrap p={{ base: 4, md: 10 }}>
        {users.map((obj, index) => (
          <WrapItem key={obj.id} mx="auto">
            <FriendCard
              id={obj.id}
              avatarUrl={obj.avatarUrl}
              name={obj.name}
              button="Add"
              onClick={async () => await onClickAdd(index)}
            />
          </WrapItem>
        ))}
      </Wrap>
    </>
  );
});
