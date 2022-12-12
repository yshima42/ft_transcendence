import * as React from 'react';
import * as C from '@chakra-ui/react';
import { useDmRooms } from 'hooks/api/dm/useDmRooms';
import { Link } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { DmRoomCard } from '../components/DmRoomCard';

export const DmRooms: React.FC = React.memo(() => {
  const { dmRooms } = useDmRooms();

  return (
    <>
      <ContentLayout title="Direct Message">
        <C.List spacing={3}>
          {dmRooms.map((dmRoom) => (
            <C.ListItem key={dmRoom.id}>
              <Link to={`${dmRoom.id}`} state={{ dmRoomId: dmRoom.id }}>
                <DmRoomCard
                  dmRoomUser={dmRoom.dmRoomUsers[0].user}
                  lastModified={new Date(dmRoom.dms[0].createdAt)}
                />
              </Link>
            </C.ListItem>
          ))}
        </C.List>
      </ContentLayout>
    </>
  );
});
