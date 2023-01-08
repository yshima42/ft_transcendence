import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomMemberStatus, ChatRoom } from '@prisma/client';
import { useBanRedirect } from 'features/chat/hooks/useBanRedirect';
import { useLeaveChatRoom } from 'features/chat/hooks/useLeaveChatRoom';
import { ResponseChatRoomMember } from 'features/chat/types/chat';
import { useGetApiOmitUndefined } from 'hooks/api/generics/useGetApi';
import * as ReactRouter from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { ChatRoomMemberList } from 'features/chat/components/organisms/ChatRoomMemberList';
import { SecurityAccordionItem } from 'features/chat/components/organisms/SecurityAccordionItem';

export const ChatRoomSettingsPage: React.FC = React.memo(() => {
  const { chatRoomId } = ReactRouter.useParams() as { chatRoomId: string };
  const chatLoginUserEndpoint = `/chat/rooms/${chatRoomId}/members/me`;
  const chatRomInfoEndpoint = `/chat/rooms/${chatRoomId}`;
  const chatRoomInviteLink = `http://localhost:5173/app/chat/rooms/${chatRoomId}/confirmation`;
  const { data: chatLoginUser } =
    useGetApiOmitUndefined<ResponseChatRoomMember>(chatLoginUserEndpoint);
  useBanRedirect(chatLoginUser);
  const { data: chatRoom } =
    useGetApiOmitUndefined<ChatRoom>(chatRomInfoEndpoint);

  return (
    <>
      <ContentLayout title="Chat Room Settings">
        {/* 招待リンク表示 */}
        <C.Box>
          <C.Text>Invite Link</C.Text>
          <C.Text>{chatRoomInviteLink}</C.Text>
        </C.Box>
        <C.Accordion allowToggle>
          {/* ChatRoomMemberListAccordion */}
          <CustomAccordion title="Chat Members">
            <ChatRoomMemberList
              chatRoomId={chatRoomId}
              chatLoginUser={chatLoginUser}
            />
          </CustomAccordion>
          {/* SecurityAccordion */}
          {chatLoginUser.memberStatus === ChatRoomMemberStatus.ADMIN && (
            <CustomAccordion title="Security">
              <SecurityAccordionItem
                roomStatus={chatRoom.roomStatus}
                chatRoomId={chatRoomId}
              />
            </CustomAccordion>
          )}
        </C.Accordion>
        {/* 退出ボタン */}
        {/* ADMINにはDeleteボタンを表示する */}
        <LeaveButton chatRoomId={chatRoomId} chatLoginUser={chatLoginUser} />
      </ContentLayout>
    </>
  );
});

// AccordionItemの共通化
const CustomAccordion: React.FC<{
  title: string;
  children: React.ReactNode;
}> = React.memo(({ title, children }) => {
  return (
    <>
      <C.AccordionItem>
        <C.AccordionButton>
          <C.Box flex="1" textAlign="left">
            {title}
          </C.Box>
          <C.AccordionIcon />
        </C.AccordionButton>
        <C.AccordionPanel pb={4}>{children}</C.AccordionPanel>
      </C.AccordionItem>
    </>
  );
});

const LeaveButton: React.FC<{
  chatRoomId: string;
  chatLoginUser: ResponseChatRoomMember;
}> = React.memo(({ chatRoomId, chatLoginUser }) => {
  const { exitChatRoom, deleteChatRoom } = useLeaveChatRoom(chatRoomId);

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
