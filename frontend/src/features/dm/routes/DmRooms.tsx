import * as React from 'react';
import * as C from '@chakra-ui/react';
import { axios } from 'lib/axios';
import { Link } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';

type ResponseDmRoom = {
  id: string;
  dmRoomUsers: Array<{
    user: {
      name: string;
      avatarImageUrl: string;
    };
  }>;
  dms: Array<{
    content: string;
    createdAt: Date;
  }>;
};

export const DmRooms: React.FC = React.memo(() => {
  const [dmRooms, setDmRooms] = React.useState<ResponseDmRoom[]>([]);

  async function getAllDmRoom(): Promise<void> {
    const res: { data: ResponseDmRoom[] } = await axios.get('/dm/room/me');
    setDmRooms(res.data);
  }

  React.useEffect(() => {
    getAllDmRoom().catch((err) => console.error(err));
  }, []);

  return (
    <>
      <ContentLayout title="Direct Message">
        <C.List spacing={3}>
          {dmRooms.map((dmRoom) => (
            <C.ListItem key={dmRoom.id}>
              <Link to={`${dmRoom.id}`} state={{ id: dmRoom.id }}>
                <C.Box p={5} shadow="md" borderWidth="1px">
                  <C.Flex>
                    <C.Box>
                      <C.Text fontSize="sm">
                        {/* 投稿がない場合は何も表示しない */}
                        {dmRoom.dms.length !== 0 ? (
                          new Date(dmRoom.dms[0].createdAt).toLocaleString()
                        ) : (
                          <></>
                        )}
                      </C.Text>
                      <C.Heading fontSize="xl">{`${dmRoom.dmRoomUsers[0].user.name}`}</C.Heading>
                      <C.Avatar
                        size="md"
                        name={`${dmRoom.dmRoomUsers[0].user.name}`}
                        src={`${dmRoom.dmRoomUsers[0].user.avatarImageUrl}`}
                      />
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
