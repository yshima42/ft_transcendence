import * as NestJs from '@nestjs/common';
import * as WebSocket from '@nestjs/websockets';
import * as SocketIO from 'socket.io';
import { ChatRoomMemberService } from './chat-room-member.service';

@WebSocket.WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat',
})
export class ChatRoomMemberGateway {
  constructor(private readonly chatRoomMemberService: ChatRoomMemberService) {}
  server!: SocketIO.Server;

  @WebSocket.SubscribeMessage('join_room')
  joinRoom(
    @WebSocket.MessageBody() chatRoomId: string,
    @WebSocket.ConnectedSocket() client: SocketIO.Socket
  ): void {
    NestJs.Logger.debug(
      'ChatRoomMemberGateway joinRoom: ' + JSON.stringify(chatRoomId)
    );
    void client.join(chatRoomId);
  }

  @WebSocket.SubscribeMessage('leave_room')
  leaveRoom(
    @WebSocket.MessageBody() chatRoomId: string,
    @WebSocket.ConnectedSocket() client: SocketIO.Socket
  ): void {
    NestJs.Logger.debug(
      'ChatRoomMemberGateway leaveRoom: ' + JSON.stringify(chatRoomId)
    );
    void client.leave(chatRoomId);
  }
}
