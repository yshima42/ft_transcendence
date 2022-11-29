import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { ContentLayout } from 'components/layout/ContentLayout';

type State = {
  id: string;
};

export const DirectMessage: React.FC = React.memo(() => {
  const location = useLocation();
  const { id } = location.state as State;
  console.log('id', id);
  // const [messages, setMessages] = React.useState<User[]>([]);

  // async function getMessages(): Promise<void> {
  //   const res: { data: User[] } = await axios.get(`/dm/${id}`);
  //   setMessages(res.data);
  // }

  // React.useEffect(() => {
  //   getMessages().catch((err) => console.error(err));
  //   console.log('messages', messages);
  // }, []);

  return (
    <>
      <ContentLayout title="Direct Message 個別のページ">
        {/* <C.List spacing={3}>
          {messages.map((message) => (
            <C.ListItem key={message.id}>
              <C.Box p={5} shadow="md" borderWidth="1px">
                <C.Flex>
                  <C.Box>
                    <C.Heading fontSize="xl">{message.name}</C.Heading>
                    <C.Text fontSize="sm">Last seen today at 5:00 PM</C.Text>
                  </C.Box>
                  <C.Box ml="auto">
                    <C.Button colorScheme="teal" size="sm">
                      DM
                    </C.Button>
                  </C.Box>
                </C.Flex>
              </C.Box>
            </C.ListItem>
          ))}
        </C.List> */}
      </ContentLayout>
    </>
  );
});
