import * as React from 'react';
import {
  ResponseChatMessage,
  ResponseChatRoomMember,
} from 'features/chat/types/chat';
import { useGetApi2 } from 'hooks/api/generics/useGetApi2';
import { useSocket } from 'hooks/socket/useSocket';
import * as SocketIOClient from 'socket.io-client';

export const useChangeChatRoomMemberStatus = (
  chatRoomId: string
): {
  chatMembers: ResponseChatRoomMember[];
  socket: SocketIOClient.Socket;
} => {
  const socket = useSocket(import.meta.env.VITE_WS_CHAT_URL);
  const { data: chatMembersData, refetch: refetchChatMembers } = useGetApi2<
    ResponseChatMessage[]
  >(`/chat/rooms/${chatRoomId}/members`);

  const chatMembers = chatMembersData as ResponseChatRoomMember[];

  React.useEffect(() => {
    const fetchDate = async () => {
      try {
        await refetchChatMembers();
      } catch (err) {
        console.log(err);
      }
    };
    // webSocket
    socket.emit('join_room_member', chatRoomId);
    // webSocketのイベントを受け取る関数を登録
    socket.on('changeChatRoomMemberStatusSocket', fetchDate);

    return () => {
      socket.emit('leave_room_member', chatRoomId);
      socket.off('changeChatRoomMemberStatusSocket', fetchDate);
    };
  }, []);

  return {
    chatMembers,
    socket,
  };
};
