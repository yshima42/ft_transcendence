import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { parse } from 'cookie';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class UsersGateway {
  public socketIdToUserId: Map<string, string>;
  public userIds: Set<string>;

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService
  ) {
    this.socketIdToUserId = new Map<string, string>();
    this.userIds = new Set<string>();
  }

  @WebSocketServer()
  private readonly server!: Server;

  async handleConnection(@ConnectedSocket() socket: Socket): Promise<void> {
    const cookie: string | undefined = socket.handshake.headers.cookie;
    if (cookie === undefined) {
      throw new UnauthorizedException();
    }
    const { accessToken } = parse(cookie);
    const payload = this.jwt.verify<{ id: string }>(accessToken, {
      secret: this.config.get('JWT_SECRET'),
    });
    const { id } = payload;
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (user === null) {
      throw new UnauthorizedException();
    }
    socket.data.userId = user.id;
    socket.data.userNickName = user.nickname;

    socket.emit('success_connect');
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
