import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DmService } from './dm.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'dm',
})
export class DmGateway {
  constructor(private readonly dmService: DmService) {}
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody()
    data: {
      content: string;
      senderId: string;
      dmRoomId: string;
    }
  ): Promise<void> {
    const { content, senderId, dmRoomId } = data;
    // TODO:エラー処理
    const newMessage = await this.dmService.create(
      { content },
      senderId,
      dmRoomId
    );
    this.server.in(dmRoomId).emit('receive_message', newMessage);
  }

  @SubscribeMessage('join_dm_room')
  joinRoom(
    @MessageBody() dmRoomId: string,
    @ConnectedSocket() client: Socket
  ): void {
    Logger.debug('joinRoom: ' + JSON.stringify(dmRoomId));
    void client.join(dmRoomId);
  }

  @SubscribeMessage('leave_dm_room')
  leaveRoom(
    @MessageBody() dmRoomId: string,
    @ConnectedSocket() client: Socket
  ): void {
    Logger.debug('leaveRoom: ' + JSON.stringify(dmRoomId));
    void client.leave(dmRoomId);
  }
}
