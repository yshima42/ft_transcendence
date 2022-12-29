import { ChatRoom } from '@prisma/client';
import { AxiosError } from 'axios';
import { axios } from 'lib/axios';
import { useNavigate } from 'react-router-dom';

export type ChatRoomCreateFormValues = {
  name: string;
  password?: string;
};

export const useCreateChatRoom = (): {
  CreateChatRoom: (data: ChatRoomCreateFormValues) => Promise<void>;
} => {
  const navigate = useNavigate();
  async function CreateChatRoom(data: ChatRoomCreateFormValues) {
    const { name, password } = data;
    try {
      const response = await axios.post<ChatRoom>(
        '/chat/rooms',
        password !== '' ? { name, password } : { name }
      );
      const chatRoom = response.data;
      navigate(`/app/chat/rooms/${chatRoom.id}`, {
        state: {
          chatRoomId: chatRoom.id,
          chatName: chatRoom.name,
          roomStatus: chatRoom.roomStatus,
        },
      });
    } catch (e) {
      const error = e as AxiosError;
      // 409
      if (error.response?.status === 409) {
        alert('this name is already used');
      }
    }
  }

  return { CreateChatRoom };
};
