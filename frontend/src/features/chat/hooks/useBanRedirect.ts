import * as React from 'react';
import { ChatRoomMemberStatus } from '@prisma/client';
import { ResponseChatRoomMember } from 'features/chat/types/chat';
import * as ReactRouter from 'react-router-dom';

// banされている場合は、/app/chat/rooms/meにリダイレクトする
export const useBanRedirect = (chatLoginUser: ResponseChatRoomMember): void => {
  const navigate = ReactRouter.useNavigate();
  const myChatRoomsLink = '/app/chat/rooms/me';

  React.useEffect(() => {
    if (chatLoginUser.memberStatus === ChatRoomMemberStatus.BANNED) {
      navigate(myChatRoomsLink);
    }
  }, [chatLoginUser]);
};
