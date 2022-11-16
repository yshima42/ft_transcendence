import { FC, memo, useEffect } from 'react';
import { Image } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { Link } from 'react-router-dom';
import { PrimaryTable } from 'components/atoms/table/PrimaryTable';
import { useAllUsers } from '../api/useAllUsers';
import { AddFriend } from './AddFriend';
import { DirectMessageButton } from './DirectMessageButton';

export const UsersList: FC = memo(() => {
  const { getUsers, users } = useAllUsers();

  useEffect(() => getUsers(), [getUsers]);

  return (
    <PrimaryTable<User>
      data={users}
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
            return <Link to={`../${name}`}>{name}</Link>;
          },
        },
        {
          title: '',
          Cell({ entry: { name } }) {
            return <DirectMessageButton id={name} />;
          },
        },
        {
          title: '',
          Cell({ entry: { name } }) {
            return <AddFriend id={name} />;
          },
        },
      ]}
    />
  );
});
