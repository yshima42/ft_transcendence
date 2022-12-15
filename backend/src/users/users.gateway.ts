import { Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtSocketAuthGuard } from 'src/auth/guards/jwt-socket-auth.guard';

@WebSocketGateway({ cors: { origin: '*' } })
export class UsersGateway {
  public socketIdToUserId: Map<string, string>;
  public userIds: Set<string>;

  constructor() {
    this.socketIdToUserId = new Map<string, string>();
    this.userIds = new Set<string>();
  }

  @WebSocketServer()
  private readonly server!: Server;

  // userIdを渡せないから使わない。guardがついたら使えるかも
  @UseGuards(JwtSocketAuthGuard)
  handleConnection(@ConnectedSocket() socket: Socket): void {
    Logger.debug('connected: ' + socket.id);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): void {
    const targetUserId = this.socketIdToUserId.get(socket.id);
    if (targetUserId !== undefined) {
      this.socketIdToUserId.delete(socket.id);
      if (this.countConnectionByUserId(targetUserId) === 0) {
        this.userIds.delete(targetUserId);
        socket.broadcast.emit('user_disconnected', targetUserId);
      }
    }

    // debug用
    Logger.debug('disconnected: ' + socket.id);
    console.table(this.socketIdToUserId);
    console.table(this.userIds);
  }

  @SubscribeMessage('handshake')
  handshake(
    @ConnectedSocket() socket: Socket,
    @MessageBody() newUserId: string
  ): string[] {
    const reconnected = this.userIds.has(newUserId);
    if (!reconnected) {
      socket.broadcast.emit('user_connected', newUserId);
    }
    this.socketIdToUserId.set(socket.id, newUserId);
    this.userIds.add(newUserId);

    // debug用
    Logger.debug('handshake: ' + socket.id);
    console.table(this.socketIdToUserId);
    console.table(this.userIds);

    return [...this.userIds];
  }

  private readonly countConnectionByUserId = (targetUserId: string): number => {
    const userIds = this.socketIdToUserId.values();
    let count = 0;
    for (const userId of userIds) {
      if (userId === targetUserId) {
        count += 1;
      }
    }

    return count;
  };
}
