import * as React from 'react';
import * as C from '@chakra-ui/react';
import * as ReactQuery from '@tanstack/react-query';
import { ResponseDm } from 'features/dm/types/dm';
import { useBlockRelation } from 'hooks/api/block/useBlockRelation';
import { useGetApiOmitUndefined } from 'hooks/api/generics/useGetApi';
import { useSocket } from 'hooks/socket/useSocket';
import { useLocation } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { Message } from 'components/molecules/Message';
import { MessageSendForm } from 'components/molecules/MessageSendForm';

type State = {
  dmRoomId: string;
  memberId: string;
};

export const DmRoom: React.FC = React.memo(() => {
  const location = useLocation();
  const { dmRoomId, memberId } = location.state as State;
  const { isUserBlocked: isBlocked } = useBlockRelation(memberId);
  const scrollBottomRef = React.useRef<HTMLDivElement>(null);
  const socket = useSocket(import.meta.env.VITE_WS_DM_URL);
  const endpoint = `/dm/rooms/${dmRoomId}/messages`;
  const { data: messages } = useGetApiOmitUndefined<ResponseDm[]>(endpoint);
  const queryClient = ReactQuery.useQueryClient();

  React.useEffect(() => {
    socket.emit('join_dm_room', dmRoomId);
    socket.on('receive_message', (message: ResponseDm) => {
      const queryKey = [endpoint];
      queryClient.setQueryData(
        queryKey,
        (oldData: ResponseDm[] | undefined) => {
          if (oldData == null) return [message];

          return [...oldData, message];
        }
      );
    });

    return () => {
      socket.off('receive_message');
      socket.emit('leave_dm_room', dmRoomId);
    };
  }, [dmRoomId, socket]);
  // 更新時の自動スクロール
  React.useEffect(() => {
    scrollBottomRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <>
      <ContentLayout title="Direct Message">
        <C.Divider />
        {isBlocked ? (
          <C.Center h="50vh">
            <C.Text>This user is blocked</C.Text>
          </C.Center>
        ) : (
          <>
            <C.Flex
              flexDir="column"
              alignItems="flex-start"
              padding={4}
              overflowY="auto"
              overflowX="hidden"
              height="70vh"
            >
              {messages.map((message) => (
                <Message
                  key={message.id}
                  id={message.id}
                  content={message.content}
                  createdAt={message.createdAt}
                  name={message.sender.name}
                  avatarImageUrl={message.sender.avatarImageUrl}
                />
              ))}
              <div ref={scrollBottomRef} />
            </C.Flex>
            <C.Divider />
            <MessageSendForm roomId={dmRoomId} socket={socket} />
          </>
        )}
      </ContentLayout>
    </>
  );
});
