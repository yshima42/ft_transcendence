import * as ReactQuery from '@tanstack/react-query';
import { useDeleteApiReset } from 'hooks/api/generics/useDeleteApiReset';
import { useNavigate } from 'react-router-dom';

const useLeaveChatRoomSub = (
  chatRoomId: string,
  endpoint: (chatRoomId: string) => string
): {
  leaveChatRoom: () => void;
} => {
  const navigate = useNavigate();
  const navigateUrl = '/app/chat/rooms/me';
  const queryKeys: ReactQuery.QueryKey[] = [['/chat/rooms/me']];

  const { mutate } = useDeleteApiReset(endpoint(chatRoomId), queryKeys);

  function leaveChatRoom() {
    mutate({});
    navigate(navigateUrl);
  }

  return { leaveChatRoom };
};

export const useLeaveChatRoom = (
  chatRoomId: string
): {
  exitChatRoom: () => void;
  deleteChatRoom: () => void;
} => {
  const exitEndpoint = (chatRoomId: string) =>
    `/chat/rooms/${chatRoomId}/members/me`;
  const deleteEndpoint = (chatRoomId: string) => `/chat/rooms/${chatRoomId}`;
  const { leaveChatRoom: exitChatRoom } = useLeaveChatRoomSub(
    chatRoomId,
    exitEndpoint
  );
  const { leaveChatRoom: deleteChatRoom } = useLeaveChatRoomSub(
    chatRoomId,
    deleteEndpoint
  );

  return { exitChatRoom, deleteChatRoom };
};
