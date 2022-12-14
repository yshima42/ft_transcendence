import { memo, FC, useContext } from 'react';
import { Box, Button, Center } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { UserAvatarContainser } from 'components/molecules/avatar/UserAvatarContainer';
import SocketContext from 'contexts/SocketContext';

export const GameTop: FC = memo(() => {
  const { socket, uid, users } = useContext(SocketContext).SocketState;

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
            Your user ID: <strong>{uid}</strong>
            <br />
            Users online: <strong>{users.length}</strong>
            <br />
            Socket ID: <strong>{socket?.id}</strong>
            <br />
          </p>
        </Box>
      </Center>
    </ContentLayout>
  );
});
