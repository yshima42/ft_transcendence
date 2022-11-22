import { FC, memo, useEffect } from 'react';
import { Wrap, WrapItem } from '@chakra-ui/react';
import { useAllFriends } from '../hooks/useAllFriends';
import { FriendCard } from './FriendCard';

export const FriendsList: FC = memo(() => {
  const { getFriends, friends } = useAllFriends();
  useEffect(() => getFriends(), [getFriends]);

  const onClickTest = () => {
    alert('onClickTest');
  };

  return (
    <Wrap p={{ base: 4, md: 10 }}>
      {friends.map((obj) => (
        <WrapItem key={obj.id} mx="auto">
          <FriendCard
            id={obj.id}
            avatarUrl={obj.avatarUrl}
            name={obj.name}
            button="test"
            onClick={onClickTest}
          />
        </WrapItem>
      ))}
    </Wrap>
  );
});

// import { FC, memo, useEffect } from 'react';
// import { Avatar, AvatarBadge } from '@chakra-ui/react';
// import { User } from '@prisma/client';
// import { Link } from 'react-router-dom';
// import { PrimaryTable } from 'components/table/PrimaryTable';
// import { useAllFriends } from '../hooks/useAllFriends';
// import { DirectMessageButton } from './DirectMessageButton';

// export const FriendsList: FC = memo(() => {
//   const { getFriends, friends } = useAllFriends();
//   useEffect(() => getFriends(), [getFriends]);

//   return (
//     <PrimaryTable<User>
//       data={friends}
//       columns={[
//         {
//           title: '',
//           Cell({ entry: { avatarUrl } }) {
//             return (
//               <Avatar src={avatarUrl}>
//                 <AvatarBadge boxSize="1.1em" bg="green.500" />
//               </Avatar>
//             );
//           },
//         },
//         {
//           title: '',
//           Cell({ entry: { name } }) {
//             return <Link to={`./${name}`}>{name}</Link>;
//           },
//         },
//         {
//           title: '',
//           Cell({ entry: { name } }) {
//             return <DirectMessageButton id={name} />;
//           },
//         },
//       ]}
//     />
//   );
// });
