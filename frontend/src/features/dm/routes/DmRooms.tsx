import * as React from 'react';
import * as C from '@chakra-ui/react';
import { useDmRooms } from 'hooks/api/dm/useDmRooms';
import { Link } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';

export const DmRooms: React.FC = React.memo(() => {
  const { dmRooms } = useDmRooms();

  return (
    <>
      <ContentLayout title="Direct Message">
        <C.List spacing={3}>
          {dmRooms.length === 0 && (
            <C.Center h="50vh">
              <C.Text>DmRoom is not found</C.Text>
            </C.Center>
          )}
          {dmRooms.map((dmRoom) => (
            <C.ListItem key={dmRoom.id}>
              <Link to={`${dmRoom.id}`} state={{ dmRoomId: dmRoom.id }}>
                <C.Box p={5} shadow="md" borderWidth="1px">
                  <C.Flex>
                    <C.Box>
                      {/* 投稿がない場合は何も表示しない */}
                      {dmRoom.dms.length !== 0 && (
                        <C.Text
                          fontSize="sm"
                          data-testid="chat-room-created-at"
                        >
                          {new Date(dmRoom.dms[0].createdAt).toLocaleString()}
                        </C.Text>
                      )}
                      <C.Heading fontSize="xl">{`${dmRoom.dmRoomMembers[0].user.name}`}</C.Heading>
                    </C.Box>
                  </C.Flex>
                </C.Box>
              </Link>
            </C.ListItem>
          ))}
        </C.List>
      </ContentLayout>
    </>
  );
});
