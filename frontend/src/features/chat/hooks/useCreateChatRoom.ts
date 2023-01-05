import { ChatRoom } from '@prisma/client';
import * as ReactQuery from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { usePostApi2 } from 'hooks/api/generics/usePostApi2';
import { useNavigate } from 'react-router-dom';

export type ChatRoomCreateFormValues = {
  name: string;
  password?: string;
};

export const useCreateChatRoom = (): {
  CreateChatRoom: (data: ChatRoomCreateFormValues) => void;
  isLoading: boolean;
} => {
  const navigate = useNavigate();
  const endpoint = '/chat/rooms';
  const queryKeys: ReactQuery.QueryKey[] = [[endpoint]];
  const { mutate, isLoading } = usePostApi2<ChatRoomCreateFormValues, ChatRoom>(
    endpoint,
    queryKeys
  );

  function CreateChatRoom(data: ChatRoomCreateFormValues) {
    if (data.password === '') {
      data.password = undefined;
    }

    return mutate(data, {
      onSuccess: (chatRoom) => {
        navigate(`/app/chat/rooms/${chatRoom.id}`);
      },
      onError: (e) => {
        const error = e as AxiosError;
        // 409
        if (error.response?.status === 409) {
          alert('this name is already used');
        }
      },
    });
  }

  return { CreateChatRoom, isLoading };
};
