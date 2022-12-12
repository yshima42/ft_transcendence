import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatMessageService } from './chat-message.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatMessageGateway {
  constructor(private readonly chatMessageService: ChatMessageService) {}
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('chat:send_message')
  async handleMessage(
    @MessageBody()
    data: {
      content: string;
      senderId: string;
      chatRoomId: string;
    }
  ): Promise<void> {
    const { content, senderId, chatRoomId } = data;
    // TODO:エラー処理
    const newMessage = await this.chatMessageService.create(
      { content },
      chatRoomId,
      senderId
    );
    Logger.log(newMessage);
    this.server.in(chatRoomId).emit('chat:receive_message', newMessage);
  }

  @SubscribeMessage('chat:join_room')
  joinRoom(
    @MessageBody() chatRoomId: string,
    @ConnectedSocket() client: Socket
  ): void {
    Logger.debug('joinRoom: ' + JSON.stringify(chatRoomId));
    void client.join(chatRoomId);
  }

  @SubscribeMessage('chat:leave_room')
  leaveRoom(
    @MessageBody() chatRoomId: string,
    @ConnectedSocket() client: Socket
  ): void {
    Logger.debug('leaveRoom: ' + JSON.stringify(chatRoomId));
    void client.leave(chatRoomId);
  }
}
