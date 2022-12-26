import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomMemberStatus, ChatRoomStatus } from '@prisma/client';
import { useChangeChatRoomMemberStatus } from 'features/chat/hooks/useChangeChatRoomMemberStatus';
import { useChatLoginUser } from 'features/chat/hooks/useChatLoginUser';
import { useChatMembers } from 'features/chat/hooks/useChatMembers';
import { useDeleteChatRoom } from 'features/chat/hooks/useDeleteChatRoom';
import { useExitChatRoom } from 'features/chat/hooks/useExitChatRoom';
import { useSocket } from 'hooks/socket/useSocket';
import { useLocation, useNavigate } from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { ChatRoomMemberActionTimeSetModal } from 'features/chat/components/organisms/ChatRoomMemberActionTimeSetModal';
import { ChatRoomMemberList } from 'features/chat/components/organisms/ChatRoomMemberList';
import { SecurityAccordionItem } from 'features/chat/components/organisms/SecurityAccordionItem';

type State = {
  chatRoomId: string;
  chatName: string;
  roomStatus: ChatRoomStatus;
};

export const ChatRoomSettings: React.FC = React.memo(() => {
  const socket = useSocket(import.meta.env.VITE_WS_CHAT_URL, {
    autoConnect: false,
  });
  const location = useLocation();
  const navigate: ReturnType<typeof useNavigate> = useNavigate();
  const { chatRoomId, chatName, roomStatus } = location.state as State;
  const { chatLoginUser, getChatLoginUser } = useChatLoginUser(
    chatRoomId,
    navigate
  );
  const { chatMembers, getChatMembers } = useChatMembers(chatRoomId);
  const { isOpen, onClose, changeChatRoomMemberStatus, setSelectedLimitTime } =
    useChangeChatRoomMemberStatus(chatRoomId, socket);

  React.useEffect(() => {
    const fetchDate = async () => {
      try {
        await getChatLoginUser();
        await getChatMembers();
      } catch (err) {
        console.log(err);
      }
    };
    void fetchDate();

    // webSocket
    socket.emit('join_room_member', chatRoomId);
    // webSocketのイベントを受け取る関数を登録
    socket.on('changeChatRoomMemberStatusSocket', fetchDate);

    return () => {
      socket.emit('leave_room_member', chatRoomId);
      socket.off('changeChatRoomMemberStatusSocket', fetchDate);
    };
  }, []);

  return (
    <>
      <ContentLayout title="Chat Room Settings">
        <C.Accordion allowToggle>
          {/* ChatRoomMemberListAccordion */}
          {chatLoginUser !== undefined && chatMembers !== undefined && (
            <CustomAccordion title="Chat Members">
              <ChatRoomMemberList
                chatLoginUser={chatLoginUser}
                chatMembers={chatMembers}
                changeChatRoomMemberStatus={changeChatRoomMemberStatus}
              />
            </CustomAccordion>
          )}
          {/* SecurityAccordion */}
          {chatLoginUser !== undefined &&
            chatLoginUser.memberStatus === ChatRoomMemberStatus.ADMIN && (
              <CustomAccordion title="Security">
                <SecurityAccordionItem
                  roomStatus={roomStatus}
                  chatRoomId={chatRoomId}
                  chatName={chatName}
                  navigate={navigate}
                />
              </CustomAccordion>
            )}
        </C.Accordion>
        {/* 退出ボタン */}
        {/* ADMINにはDeleteボタンを表示する */}
        <LeaveButton
          chatRoomId={chatRoomId}
          chatLoginUser={chatLoginUser}
          navigate={navigate}
        />
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
  navigate: ReturnType<typeof useNavigate>;
  chatLoginUser: ReturnType<typeof useChatLoginUser>['chatLoginUser'];
}> = React.memo(({ chatRoomId, navigate, chatLoginUser }) => {
  const { exitChatRoom } = useExitChatRoom(chatRoomId, navigate);
  const { deleteChatRoom } = useDeleteChatRoom(chatRoomId, navigate);

  return (
    <>
      {chatLoginUser !== undefined &&
        (chatLoginUser.memberStatus !== ChatRoomMemberStatus.ADMIN ? (
          <C.Button colorScheme="red" onClick={exitChatRoom}>
            Exit
          </C.Button>
        ) : (
          <C.Button colorScheme="red" onClick={deleteChatRoom}>
            Delete
          </C.Button>
        ))}
    </>
  );
});
