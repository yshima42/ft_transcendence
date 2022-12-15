import { memo, FC, useContext } from 'react';
import { Box, Button, Center, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { UserAvatarContainser } from 'components/molecules/avatar/UserAvatarContainer';
import { OnlineUsersContext } from 'providers/OnlineUsersProvider';

export const GameTop: FC = memo(() => {
  const users = useContext(OnlineUsersContext);

  return (
    <ContentLayout title="">
      <UserAvatarContainser
        id="1927390d-db63-4700-875c-f8bb74dcb562"
        src="https://cdn.intra.42.fr/users/01632fdcc806e2656d87a8e9150f74f1/hyoshie.jpg"
      />
      <Center>
        <Link to="matching">
          <Button>Rank Match</Button>
        </Link>
      </Center>
      <Center>
        <Box>
          <h2>Socket IO Information:</h2>
          <p>
            Users online: <strong>{users.length}</strong>
            <br />
          </p>
          <p>Users online:</p>
          {users.map((user, index) => (
            <Text key={user}>{`${index}: ${user}`}</Text>
          ))}
        </Box>
      </Center>
    </ContentLayout>
  );
});
