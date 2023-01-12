import * as React from 'react';
import * as C from '@chakra-ui/react';
import { ChatRoomMemberStatus } from '@prisma/client';
import { useBanRedirect } from 'features/chat/hooks/useBanRedirect';
import { useLeaveChatRoom } from 'features/chat/hooks/useLeaveChatRoom';
import { ResponseChatRoomMember } from 'features/chat/types/chat';
import { useGetApiOmitUndefined } from 'hooks/api/generics/useGetApi';
import * as ReactRouter from 'react-router-dom';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { ChangeChatRoomStatusButtons } from 'features/chat/components/organisms/ChangeChatRoomStatusButtons';
import { ChatRoomMemberList } from 'features/chat/components/organisms/ChatRoomMemberList';

export const ChatRoomSettingsPage: React.FC = React.memo(() => {
  const { chatRoomId } = ReactRouter.useParams() as { chatRoomId: string };
  const chatLoginUserEndpoint = `/chat/rooms/${chatRoomId}/members/me`;
  const chatRoomInviteLink = `http://localhost:5173/app/chat/rooms/${chatRoomId}/confirmation`;
  const { data: chatLoginUser } =
    useGetApiOmitUndefined<ResponseChatRoomMember>(chatLoginUserEndpoint);
  useBanRedirect(chatLoginUser);

  return (
    <>
      <ContentLayout title="Chat Room Settings">
        {/* 招待リンク表示 */}
        <C.Box>
          <C.Text>Invite Link</C.Text>
          <C.Text>{chatRoomInviteLink}</C.Text>
        </C.Box>
        {/* チャットルームの状態変更ボタン  chatLoginUserがOWNERの場合のみ表示する */}
        {chatLoginUser.memberStatus === ChatRoomMemberStatus.OWNER && (
          <ChangeChatRoomStatusButtons chatRoomId={chatRoomId} />
        )}
        <C.Accordion allowToggle>
          {/* ChatRoomMemberListAccordion */}
          <C.AccordionItem>
            <C.AccordionButton>
              <C.Box flex="1" textAlign="left">
                Chat Members
              </C.Box>
              <C.AccordionIcon />
            </C.AccordionButton>
            <C.AccordionPanel pb={4}>
              <ChatRoomMemberList
                chatRoomId={chatRoomId}
                chatLoginUser={chatLoginUser}
              />
            </C.AccordionPanel>
          </C.AccordionItem>
        </C.Accordion>
        {/* 退出ボタン */}
        {/* ADMINにはDeleteボタンを表示する */}
        <LeaveButton chatRoomId={chatRoomId} chatLoginUser={chatLoginUser} />
      </ContentLayout>
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
      {chatLoginUser.memberStatus !== ChatRoomMemberStatus.OWNER ? (
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
