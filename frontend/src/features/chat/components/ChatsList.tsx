import { FC, memo, useEffect } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { PrimaryTable } from 'components/atoms/table/PrimaryTable';
import { useAllChats } from '../api/useAllChats';
import { Chat } from '../types/chat';

export const ChatsList: FC = memo(() => {
  const { getChats, chats } = useAllChats();

  useEffect(() => getChats(), [getChats]);

  return (
    <PrimaryTable<Chat>
      data={chats}
      columns={[
        {
          title: 'id',
          Cell({ entry: { id } }) {
            return <Box>{id}</Box>;
          },
        },
        {
          title: 'members',
          Cell({ entry: { members } }) {
            return <Box>{members}</Box>;
          },
        },
        {
          title: 'start time',
          Cell({ entry: { createdAt } }) {
            return <Box>{createdAt}</Box>;
          },
        },
        {
          title: 'Join',
          Cell({ entry: { id } }) {
            return (
              <Link to={`${id}`}>
                <Button>Join</Button>
              </Link>
            );
          },
        },
      ]}
    />
  );
});
