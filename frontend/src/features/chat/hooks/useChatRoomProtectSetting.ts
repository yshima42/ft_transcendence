import { ChatRoomStatus } from '@prisma/client';
import { axios } from 'lib/axios';
import * as ReactHookForm from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

type Inputs = {
  password: string;
  chatRoomId: string;
  chatName: string;
};

export const useChatRoomProtectSetting = (
  navigate: ReturnType<typeof useNavigate>
): {
  protectChatRoom: ReactHookForm.SubmitHandler<Inputs>;
  publicChatRoom: ReactHookForm.SubmitHandler<Omit<Inputs, 'password'>>;
} => {
  const protectChatRoom: ReactHookForm.SubmitHandler<Inputs> = async (data) => {
    const { password, chatRoomId, chatName } = data;

    await axios.patch(`/chat/rooms/${chatRoomId}`, {
      password,
      roomStatus: ChatRoomStatus.PROTECTED,
    });
    navigate(`/app/chat/rooms/${chatRoomId}`, {
      state: {
        chatRoomId,
        chatName,
        roomStatus: ChatRoomStatus.PROTECTED,
      },
    });
  };

  const publicChatRoom: ReactHookForm.SubmitHandler<
    Omit<Inputs, 'password'>
  > = async (data) => {
    const { chatRoomId, chatName } = data;
    await axios.patch(`/chat/rooms/${chatRoomId}`, {
      roomStatus: ChatRoomStatus.PUBLIC,
    });
    navigate(`/app/chat/rooms/${chatRoomId}`, {
      state: {
        chatRoomId,
        chatName,
        roomStatus: ChatRoomStatus.PUBLIC,
      },
    });
  };

  return {
    protectChatRoom,
    publicChatRoom,
  };
};
