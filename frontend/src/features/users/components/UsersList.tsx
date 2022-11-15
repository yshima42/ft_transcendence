import { FC, memo, useEffect } from 'react';
import { Image, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { PrimaryTable } from 'components/atoms/table/PrimaryTable';
import { useAllUsers } from '../api/useAllUsers';
import { User } from '../types/user';

export const UsersList: FC = memo(() => {
  const { getUsers, users } = useAllUsers();

  useEffect(() => getUsers(), [getUsers]);

  return (
    <PrimaryTable<User>
      data={users}
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
              <Button>
                <Link to={`../game/${name}`}>対戦</Link>
              </Button>
            );
          },
        },
        {
          title: '',
          Cell({ entry: { name } }) {
            return (
              <Button>
                <Link to={`../dm/${name}`}>メッセージ</Link>
              </Button>
            );
          },
        },
        {
          title: '',
          Cell({ entry: { name } }) {
            return <Button about={name}>友達追加</Button>;
          },
        },
      ]}
    />
  );
});
