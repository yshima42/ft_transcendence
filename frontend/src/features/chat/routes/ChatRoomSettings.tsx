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
  const { exitChatRoom } = useExitChatRoom(chatRoomId, navigate);
  const { deleteChatRoom } = useDeleteChatRoom(chatRoomId, navigate);
  const { isOpen, onClose, changeChatRoomMemberStatus, setSelectedLimitTime } =
    useChangeChatRoomMemberStatus(chatRoomId, socket);

  React.useEffect(() => {
    getChatLoginUser().catch((err) => console.log(err));
    getChatMembers().catch((err) => console.log(err));

    // webSocket
    socket.emit('join_room_member', chatRoomId);
    // webSocketのイベントを受け取る関数を登録
    socket.on('changeChatRoomMemberStatusSocket', () => {
      getChatLoginUser().catch((err) => console.log(err));
      getChatMembers().catch((err) => console.log(err));
    });

    return () => {
      socket.emit('leave_room_member', chatRoomId);
      socket.off('changeChatRoomMemberStatusSocket');
    };
  }, []);

  return (
    <>
      <ContentLayout title="Chat Room Settings">
        <C.Accordion allowToggle>
          <C.AccordionItem>
            <C.AccordionButton>
              <C.Box flex="1" textAlign="left">
                Chat Members
              </C.Box>
              <C.AccordionIcon />
            </C.AccordionButton>
            <C.AccordionPanel pb={4}>
              {chatLoginUser !== undefined && chatMembers !== undefined && (
                <ChatRoomMemberList
                  chatLoginUser={chatLoginUser}
                  chatMembers={chatMembers}
                  changeChatRoomMemberStatus={changeChatRoomMemberStatus}
                />
              )}
            </C.AccordionPanel>
          </C.AccordionItem>
          {/* LoginUserがADMINならセキュリティタブを出す */}
          {chatLoginUser !== undefined &&
            chatLoginUser.memberStatus === ChatRoomMemberStatus.ADMIN && (
              <C.AccordionItem>
                <C.AccordionButton>
                  <C.Box flex="1" textAlign="left">
                    Security
                  </C.Box>
                  <C.AccordionIcon />
                </C.AccordionButton>
                <C.AccordionPanel pb={4}>
                  <SecurityAccordionItem
                    roomStatus={roomStatus}
                    chatRoomId={chatRoomId}
                    chatName={chatName}
                    navigate={navigate}
                  />
                </C.AccordionPanel>
              </C.AccordionItem>
            )}
        </C.Accordion>
        {/* 退出ボタン */}
        {/* ADMINには退出ボタンを表示しない */}
        {chatLoginUser !== undefined &&
          chatLoginUser.memberStatus !== ChatRoomMemberStatus.ADMIN && (
            <C.Button
              colorScheme="red"
              onClick={async () => await exitChatRoom()}
            >
              Exit
            </C.Button>
          )}
        {/* LoginUserがADMINなら消去ボタンを出す */}
        {chatLoginUser !== undefined &&
          chatLoginUser.memberStatus === ChatRoomMemberStatus.ADMIN && (
            <C.Button
              colorScheme="red"
              onClick={async () => await deleteChatRoom()}
            >
              Delete
            </C.Button>
          )}
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
