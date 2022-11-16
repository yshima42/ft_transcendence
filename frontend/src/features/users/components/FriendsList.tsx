import { FC, memo, useEffect } from 'react';
import { Image } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { Link } from 'react-router-dom';
import { PrimaryTable } from 'components/atoms/table/PrimaryTable';
import { useAllFriends } from '../api/useAllFriends';
import { DirectMessageButton } from './DirectMessageButton';

export const FriendsList: FC = memo(() => {
  const { getFriends, friends } = useAllFriends();

  useEffect(() => getFriends(), [getFriends]);

  return (
    <PrimaryTable<User>
      data={friends}
      columns={[
        {
          title: '',
          Cell({ entry: { name, avatarUrl } }) {
            return (
              <Image
                borderRadius="full"
                boxSize="48px"
                src={avatarUrl}
                alt={name}
              />
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
