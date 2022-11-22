import { FC, memo, useEffect } from 'react';
import { Wrap, WrapItem } from '@chakra-ui/react';
import { useAllUsers } from '../hooks/useAllUsers';
import { FriendCard } from './FriendCard';

export const UsersList: FC = memo(() => {
  const { getUsers, users } = useAllUsers();

  useEffect(() => getUsers(), [getUsers]);

  const onClickAddFriend = () => {
    alert('onClickAddFriend');
  };

  return (
    <Wrap p={{ base: 4, md: 10 }}>
      {users.map((obj) => (
        <WrapItem key={obj.id} mx="auto">
          <FriendCard
            id={obj.id}
            avatarUrl={obj.avatarUrl}
            name={obj.name}
            button="Add"
            onClick={onClickAddFriend}
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
