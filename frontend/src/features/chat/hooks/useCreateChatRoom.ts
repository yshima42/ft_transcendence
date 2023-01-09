import * as React from 'react';
import { ChatRoom, ChatRoomStatus } from '@prisma/client';
import * as ReactQuery from '@tanstack/react-query';
import { usePostApiWithErrorToast } from 'hooks/api/generics/usePostApi';
import { useNavigate } from 'react-router-dom';

export type ChatRoomCreateFormValues = {
  name: string;
  roomStatus: ChatRoomStatus;
  password?: string;
};

export const useCreateChatRoom = (): {
  CreateChatRoom: (data: ChatRoomCreateFormValues) => void;
  isLoading: boolean;
} => {
  const navigate = useNavigate();
  const endpoint = '/chat/rooms';
  const chatRoomLink = (chatRoomId: string) => `/app/chat/rooms/${chatRoomId}`;
  const queryKeys: ReactQuery.QueryKey[] = [[endpoint]];
  const {
    status,
    data: chatRoom,
    isLoading,
    mutate,
  } = usePostApiWithErrorToast<ChatRoomCreateFormValues, ChatRoom>(
    endpoint,
    queryKeys
  );

  React.useEffect(() => {
    if (status === 'success') {
      navigate(chatRoomLink(chatRoom.id));
    }
  }, [status]);

  return { CreateChatRoom: mutate, isLoading };
};
