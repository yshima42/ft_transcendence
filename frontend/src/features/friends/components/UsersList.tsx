import { FC, memo, useEffect } from 'react';
import { Wrap, WrapItem } from '@chakra-ui/react';
import { axios } from '../../../lib/axios';
import { useAllUsers } from '../hooks/useAllUsers';
import { FriendCard } from './FriendCard';

export const UsersList: FC = memo(() => {
  const { getUsers, users, setUsers } = useAllUsers();

  useEffect(() => getUsers(), [getUsers]);

  const onClickAddFriend = async (index: number) => {
    const newUsers = [...users];

    newUsers.splice(index, 1);
    const params = new URLSearchParams();
    params.append('peerId', `${users[index].id}`);

    await axios.post('/friendships/request', params);

    setUsers(newUsers);
  };

  return (
    <Wrap p={{ base: 4, md: 10 }}>
      {users.map((obj, index) => (
        <WrapItem key={obj.id} mx="auto">
          <FriendCard
            id={obj.id}
            avatarUrl={obj.avatarUrl}
            name={obj.name}
            button="Add"
            onClick={async () => await onClickAddFriend(index)}
          />
        </WrapItem>
      ))}
    </Wrap>
  );
});

// import { FC, memo, useEffect } from 'react';
// import { Avatar } from '@chakra-ui/react';
// import { User } from '@prisma/client';
// import { Link } from 'react-router-dom';
// import { PrimaryTable } from 'components/table/PrimaryTable';
// import { useAllUsers } from '../hooks/useAllUsers';
// import { AddFriend } from './AddFriend';
// import { DirectMessageButton } from './DirectMessageButton';

// export const UsersList: FC = memo(() => {
//   const { getUsers, users } = useAllUsers();

//   useEffect(() => getUsers(), [getUsers]);

//   return (
//     <PrimaryTable<User>
//       data={users}
//       columns={[
//         {
//           title: '',
//           Cell({ entry: { avatarUrl } }) {
//             return <Avatar size="md" src={avatarUrl} />;
//           },
//         },
//         {
//           title: '',
//           Cell({ entry: { name } }) {
//             return <Link to={`../${name}`}>{name}</Link>;
//           },
//         },
//         {
//           title: '',
//           Cell({ entry: { name } }) {
//             return <DirectMessageButton id={name} />;
//           },
//         },
//         {
//           title: '',
//           Cell({ entry: { name } }) {
//             return <AddFriend id={name} />;
//           },
//         },
//       ]}
//     />
//   );
// });