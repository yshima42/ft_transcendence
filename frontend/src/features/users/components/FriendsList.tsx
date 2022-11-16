import { FC, memo, useEffect } from 'react';
import { Image, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { PrimaryTable } from 'components/atoms/table/PrimaryTable';
import { useAllFriends } from '../api/useAllFriends';
import { User } from '../types/user';

export const FriendsList: FC = memo(() => {
  const { getFriends, friends } = useAllFriends();

  useEffect(() => getFriends(), [getFriends]);

  return (
    <PrimaryTable<User>
      data={friends}
      columns={[
        {
          title: '',
          Cell({ entry: { name } }) {
            return (
              <Image
                boxSize="48px"
                src="https://source.unsplash.com/random"
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
            return (
              <Link to={`../dm/${name}`}>
                {' '}
                <Button>メッセージ</Button>
              </Link>
            );
          },
        },
        {
          title: '',
          Cell({ entry: { name } }) {
            return <Button about={name}>友達削除</Button>;
          },
        },
      ]}
    />
  );
});
