import { ChatRoomStatus } from '@prisma/client';
import * as ReactQuery from '@tanstack/react-query';
import { usePatchApi } from 'hooks/api/generics/usePatchApi';
import * as ReactHookForm from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

type Inputs = {
  roomStatus: ChatRoomStatus;
  password?: string | undefined;
};

export const useChatRoomProtectSetting = (
  chatRoomId: string
): {
  changeChatRoomStatusProtect: (
    data: ReactHookForm.UseFormReturn<Inputs>['getValues']
  ) => void;
  changeChatRoomStatusPublic: () => void;
  changeChatRoomStatusPrivate: () => void;
} => {
  const navigate = useNavigate();
  const endpoint = `/chat/rooms/${chatRoomId}`;
  const url = `/app/chat/rooms/${chatRoomId}`;
  const queryKeys: ReactQuery.QueryKey[] = [['/chat/rooms']];
  const { mutate } = usePatchApi<Inputs, Promise<void>>(endpoint, queryKeys);

  const changeChatRoomStatusProtect = (data: { password: string }) => {
    const inputs: Inputs = {
      roomStatus: ChatRoomStatus.PROTECTED,
      password: data.password,
    };
    mutate(inputs, { onSuccess: () => navigate(url) });
  };

  const changeChatRoomStatusPublic = () => {
    const inputs: Inputs = {
      roomStatus: ChatRoomStatus.PUBLIC,
      password: undefined,
    };
    mutate(inputs, { onSuccess: () => navigate(url) });
  };

  const changeChatRoomStatusPrivate = () => {
    const inputs: Inputs = {
      roomStatus: 'PRIVATE',
      password: undefined,
    };
    mutate(inputs, { onSuccess: () => navigate(url) });
  };

  return {
    changeChatRoomStatusProtect,
    changeChatRoomStatusPublic,
    changeChatRoomStatusPrivate,
  };
};
