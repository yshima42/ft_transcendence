import * as React from 'react';
import * as C from '@chakra-ui/react';
import { User } from '@prisma/client';
import { axios } from 'lib/axios';
import { Link } from 'react-router-dom';
import { ContentLayout } from 'components/layout/ContentLayout';

export const DirectMessageList: React.FC = React.memo(() => {
  const [users, setUsers] = React.useState<User[]>([]);
  async function getAllUsers(): Promise<void> {
    const res: { data: User[] } = await axios.get('/users/all');
    setUsers(res.data);
  }
  React.useEffect(() => {
    getAllUsers().catch((err) => console.error(err));
    console.log('users', users);
  }, []);

  return (
    <>
      <ContentLayout title="Direct Message">
        <C.List spacing={3}>
          {users.map((user) => (
            <C.ListItem key={user.id}>
              <C.Box p={5} shadow="md" borderWidth="1px">
                <C.Flex>
                  <C.Box>
                    <C.Heading fontSize="xl">{user.name}</C.Heading>
                    <C.Text fontSize="sm">Last seen today at 5:00 PM</C.Text>
                  </C.Box>
                  <C.Box ml="auto">
                    <C.Link as={Link} to={`${user.id}`} state={{ id: user.id }}>
                      <C.Button colorScheme="teal" size="sm">
                        DM
                      </C.Button>
                    </C.Link>
                  </C.Box>
                </C.Flex>
              </C.Box>
            </C.ListItem>
          ))}
        </C.List>
      </ContentLayout>
    </>
  );
});
