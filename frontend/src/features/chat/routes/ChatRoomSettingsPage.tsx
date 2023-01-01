import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomMemberStatus, ChatRoom } from '@prisma/client';
import { useChangeChatRoomMemberStatus } from 'features/chat/hooks/useChangeChatRoomMemberStatus';
import { useDeleteChatRoom } from 'features/chat/hooks/useDeleteChatRoom';
import { useExitChatRoom } from 'features/chat/hooks/useExitChatRoom';
import {
  ResponseChatMessage,
  ResponseChatRoomMember,
  ResponseChatRoomMemberStatus,
} from 'features/chat/types/chat';
import { useGetApi2 } from 'hooks/api/generics/useGetApi2';
import { useSocket } from 'hooks/socket/useSocket';
import * as ReactRouter from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { ChatRoomMemberActionTimeSetModal } from 'features/chat/components/organisms/ChatRoomMemberActionTimeSetModal';
import { ChatRoomMemberList } from 'features/chat/components/organisms/ChatRoomMemberList';
import { SecurityAccordionItem } from 'features/chat/components/organisms/SecurityAccordionItem';

export const ChatRoomSettingsPage: React.FC = React.memo(() => {
  const socket = useSocket(import.meta.env.VITE_WS_CHAT_URL);
  const { chatRoomId } = ReactRouter.useParams() as { chatRoomId: string };
  const { data: chatLoginUserData } = useGetApi2<ResponseChatRoomMember>(
    `/chat/rooms/${chatRoomId}/members/me`
  );
  useGetApi2<ResponseChatRoomMember>(`/chat/rooms/${chatRoomId}/members/me`);
  const { data: chatRoomData } = useGetApi2<ResponseChatRoomMemberStatus>(
    `/chat/rooms/${chatRoomId}`
  );
  const { data: chatMembersData, refetch: refetchChatMembers } = useGetApi2<
    ResponseChatMessage[]
  >(`/chat/rooms/${chatRoomId}/members`);
  const { isOpen, onClose, changeChatRoomMemberStatus, setSelectedLimitTime } =
    useChangeChatRoomMemberStatus(chatRoomId, socket);
  React.useEffect(() => {
    const fetchDate = async () => {
      try {
        await refetchChatMembers();
      } catch (err) {
        console.log(err);
      }
    };
    // webSocket
    socket.emit('join_room_member', chatRoomId);
    // webSocketのイベントを受け取る関数を登録
    socket.on('changeChatRoomMemberStatusSocket', fetchDate);

    return () => {
      socket.emit('leave_room_member', chatRoomId);
      socket.off('changeChatRoomMemberStatusSocket', fetchDate);
    };
  }, []);
  const chatLoginUser = chatLoginUserData as ResponseChatRoomMember;
  const chatMembers = chatMembersData as ResponseChatRoomMember[];
  const { name: chatName, roomStatus } = chatRoomData as ChatRoom;

  return (
    <>
      <ContentLayout title="Chat Room Settings">
        <C.Accordion allowToggle>
          {/* ChatRoomMemberListAccordion */}
          <CustomAccordion title="Chat Members">
            <ChatRoomMemberList
              chatLoginUser={chatLoginUser}
              chatMembers={chatMembers}
              changeChatRoomMemberStatus={changeChatRoomMemberStatus}
            />
          </CustomAccordion>
          {/* SecurityAccordion */}
          {chatLoginUser.memberStatus === ChatRoomMemberStatus.ADMIN && (
            <CustomAccordion title="Security">
              <SecurityAccordionItem
                roomStatus={roomStatus}
                chatRoomId={chatRoomId}
                chatName={chatName}
              />
            </CustomAccordion>
          )}
        </C.Accordion>
        {/* 退出ボタン */}
        {/* ADMINにはDeleteボタンを表示する */}
        <LeaveButton chatRoomId={chatRoomId} chatLoginUser={chatLoginUser} />
      </ContentLayout>
      <ChatRoomMemberActionTimeSetModal
        isOpen={isOpen}
        onClose={onClose}
        onClick={(limitTime) => {
          setSelectedLimitTime(limitTime);
          onClose();
        }}
      />
    </>
  );
});

// AccordionItemの共通化
const CustomAccordion: React.FC<{
  title: string;
  children: React.ReactNode;
}> = React.memo(({ title, children }) => {
  return (
    <C.AccordionItem>
      <C.AccordionButton>
        <C.Box flex="1" textAlign="left">
          {title}
        </C.Box>
        <C.AccordionIcon />
      </C.AccordionButton>
      <C.AccordionPanel pb={4}>{children}</C.AccordionPanel>
    </C.AccordionItem>
  );
});

const LeaveButton: React.FC<{
  chatRoomId: string;
  chatLoginUser: ResponseChatRoomMember;
}> = React.memo(({ chatRoomId, chatLoginUser }) => {
  const { exitChatRoom } = useExitChatRoom(chatRoomId);
  const { deleteChatRoom } = useDeleteChatRoom(chatRoomId);

  return (
    <>
      {chatLoginUser.memberStatus !== ChatRoomMemberStatus.ADMIN ? (
        <C.Button colorScheme="red" onClick={exitChatRoom}>
          Exit
        </C.Button>
      ) : (
        <C.Button colorScheme="red" onClick={deleteChatRoom}>
          Delete
        </C.Button>
      )}
    </>
  );
});
