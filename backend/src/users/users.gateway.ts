import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class UsersGateway {
  public onlineUserIdTosocketId: Map<string, string>;

  constructor() {
    this.onlineUserIdTosocketId = new Map<string, string>();
  }

  @WebSocketServer()
  private readonly server!: Server;

  handleConnection(@ConnectedSocket() socket: Socket): void {
    Logger.debug('connected: ' + socket.id);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): void {
    Logger.debug('disconnected: ' + socket.id);
    const onlineUserId = this.getUserIdBySocketId(socket.id);
    if (onlineUserId !== undefined) {
      this.onlineUserIdTosocketId.delete(onlineUserId);
    }
    socket.broadcast.emit('user_disconnected', socket.id);
  }

  @SubscribeMessage('handshake')
  handshake(
    @ConnectedSocket() socket: Socket,
    @MessageBody() userId: string
  ): string[] {
    this.onlineUserIdTosocketId.set(userId, socket.id);
    socket.broadcast.emit('user_connected', socket.id);

    return [...this.onlineUserIdTosocketId.values()];
  }

  private readonly getUserIdBySocketId = (id: string): string | undefined => {
    const keyValues = this.onlineUserIdTosocketId.entries();
    let userId;
    for (const keyValue of keyValues) {
      if (keyValue[1] === id) {
        userId = keyValue[0];
      }
    }

    return userId;
  };
}
