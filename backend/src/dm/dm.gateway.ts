import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ResponseDm } from './dm.interface';
import { DmService } from './dm.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class DmGateway {
  constructor(private readonly dmService: DmService) {}
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody()
    data: { message: ResponseDm; senderId: string; dmRoomId: string },
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    const { message, senderId, dmRoomId } = data;
    await this.dmService.create(
      { content: message.content },
      senderId,
      dmRoomId
    );
    client.to(dmRoomId).emit('receive_message', message);
  }

  @SubscribeMessage('join_room')
  joinRoom(
    @MessageBody() dmRoomId: string,
    @ConnectedSocket() client: Socket
  ): void {
    Logger.debug('joinRoom: ' + JSON.stringify(dmRoomId));
    void client.join(dmRoomId);
  }

  @SubscribeMessage('leave_room')
  leaveRoom(
    @MessageBody() dmRoomId: string,
    @ConnectedSocket() client: Socket
  ): void {
    Logger.debug('leaveRoom: ' + JSON.stringify(dmRoomId));
    void client.leave(dmRoomId);
  }
}
