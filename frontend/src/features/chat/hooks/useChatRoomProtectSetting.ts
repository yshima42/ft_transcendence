import { ChatRoomStatus } from '@prisma/client';
import { axios } from 'lib/axios';
import * as ReactHookForm from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

type Inputs = {
  password: string;
  chatRoomId: string;
  chatName: string;
};

export const useChatRoomProtectSetting = (): {
  protectChatRoom: ReactHookForm.SubmitHandler<Inputs>;
  publicChatRoom: ReactHookForm.SubmitHandler<Omit<Inputs, 'password'>>;
} => {
  const navigate = useNavigate();
  const endpoint = (chatRoomId: string) => `/chat/rooms/${chatRoomId}`;
  const url = (chatRoomId: string) => `/app/chat/rooms/${chatRoomId}`;

  const protectChatRoom: ReactHookForm.SubmitHandler<Inputs> = async (data) => {
    const { password, chatRoomId } = data;

    await axios.patch(endpoint(chatRoomId), {
      password,
      roomStatus: ChatRoomStatus.PROTECTED,
    });
    navigate(url(chatRoomId));
  };

  const publicChatRoom: ReactHookForm.SubmitHandler<
    Omit<Inputs, 'password'>
  > = async (data) => {
    const { chatRoomId } = data;
    await axios.patch(endpoint(chatRoomId), {
      roomStatus: ChatRoomStatus.PUBLIC,
    });
    navigate(url(chatRoomId));
  };

  return {
    protectChatRoom,
    publicChatRoom,
  };
};
