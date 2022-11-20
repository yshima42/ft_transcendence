import { FC, memo } from 'react';
// import { FC, memo, useEffect } from 'react';
import { Avatar, AvatarBadge } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { Link } from 'react-router-dom';
import { PrimaryTable } from 'components/atoms/table/PrimaryTable';
import { useAllFriends } from '../hooks/useAllFriends';
import { DirectMessageButton } from './DirectMessageButton';

export const FriendsList: FC = memo(() => {
  // const { getFriends, friends } = useAllFriends();
  // useEffect(() => getFriends(), [getFriends]);

  const data = useAllFriends();

  if (data === undefined) return <></>;

  return (
    <PrimaryTable<User>
      // data={friends}
      data={data}
      columns={[
        {
          title: '',
          Cell({ entry: { avatarUrl } }) {
            return (
              <Avatar src={avatarUrl}>
                <AvatarBadge boxSize="1.1em" bg="green.500" />
              </Avatar>
            );
          },
        },
        {
          title: '',
          Cell({ entry: { name } }) {
            return <Link to={`./${name}`}>{name}</Link>;
          },
        },
        {
          title: '',
          Cell({ entry: { name } }) {
            return <DirectMessageButton id={name} />;
          },
        },
      ]}
    />
  );
});
