import { ChatRoomStatus } from '@prisma/client';
import * as ReactQuery from '@tanstack/react-query';
import { usePatchApiWithErrorToast } from 'hooks/api/generics/usePatchApi';
import { useNavigate } from 'react-router-dom';

export const useChatRoomProtectSetting = (
  chatRoomId: string
): {
  changeChatRoomStatusProtect: (data: { password: string }) => void;
  changeChatRoomStatusPublic: () => void;
  changeChatRoomStatusPrivate: () => void;
} => {
  const navigate = useNavigate();
  const endpoint = `/chat/rooms/${chatRoomId}`;
  const url = `/app/chat/rooms/${chatRoomId}`;
  const queryKeys: ReactQuery.QueryKey[] = [['/chat/rooms']];
  const { mutate } = usePatchApiWithErrorToast<
    {
      roomStatus: ChatRoomStatus;
      password: string | undefined;
    },
    Promise<void>
  >(endpoint, queryKeys);

  const changeChatRoomStatusProtect = (data: { password: string }) => {
    mutate({
      roomStatus: ChatRoomStatus.PROTECTED,
      password: data.password,
    });
    navigate(url);
  };

  const changeChatRoomStatusPublic = () => {
    mutate({
      roomStatus: ChatRoomStatus.PUBLIC,
      password: undefined,
    });
    navigate(url);
  };

  const changeChatRoomStatusPrivate = () => {
    mutate({
      roomStatus: ChatRoomStatus.PRIVATE,
      password: undefined,
    });
    navigate(url);
  };

  return {
    changeChatRoomStatusProtect,
    changeChatRoomStatusPublic,
    changeChatRoomStatusPrivate,
  };
};
