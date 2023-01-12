import * as NestJs from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as WebSocket from '@nestjs/websockets';
import { parse } from 'cookie';
import * as SocketIO from 'socket.io';
import { DmService } from './dm.service';
import { CreateDmDto } from './dto/create-dm.dto';

@WebSocket.WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173/',
  },
  namespace: 'dm',
})
export class DmGateway {
  constructor(
    private readonly dmService: DmService,
    private readonly jwt: JwtService
  ) {}

  @WebSocket.WebSocketServer()
  server!: SocketIO.Server;

  // Logger関数
  private readonly logger = new NestJs.Logger('DmGateway');
  private readonly json = (obj: any): string => JSON.stringify(obj, null, 2);

  // userIdとclientを紐付ける
  handleConnection(@WebSocket.ConnectedSocket() client: SocketIO.Socket): void {
    const cookie = client.handshake.headers.cookie;
    if (cookie === undefined) {
      this.logger.warn('cookie is undefined');

      return;
    }
    const chatLoginUserId = this.getUserIdFromCookie(cookie);
    this.logger.debug(`handleConnection: ${chatLoginUserId}`);
    // clientにuserIdを紐付ける
    client.data.userId = chatLoginUserId;
  }

  // userIdとclientの紐付けを解除する
  handleDisconnect(@WebSocket.ConnectedSocket() client: SocketIO.Socket): void {
    const cookie = client.handshake.headers.cookie;
    if (cookie === undefined) {
      this.logger.warn('cookie is undefined');

      return;
    }
    const chatLoginUserId = this.getUserIdFromCookie(cookie);
    this.logger.debug(`handleDisconnect: ${chatLoginUserId}`);
    // clientからuserIdを削除する
    delete client.data.userId;
  }

  @WebSocket.SubscribeMessage('send_message')
  async handleMessage(
    @WebSocket.MessageBody()
    createDmDto: CreateDmDto,
    @WebSocket.ConnectedSocket() client: SocketIO.Socket
  ): Promise<void> {
    const newMessage = await this.dmService.create(
      createDmDto,
      client.data.userId as string
    );
    this.server.in(createDmDto.roomId).emit('receive_message', newMessage);
  }

  @WebSocket.SubscribeMessage('join_dm_room')
  joinRoom(
    @WebSocket.MessageBody() dmRoomId: string,
    @WebSocket.ConnectedSocket() client: SocketIO.Socket
  ): void {
    this.logger.debug('joinRoom: ' + JSON.stringify(dmRoomId));
    void client.join(dmRoomId);
  }

  @WebSocket.SubscribeMessage('leave_dm_room')
  leaveRoom(
    @WebSocket.MessageBody() dmRoomId: string,
    @WebSocket.ConnectedSocket() client: SocketIO.Socket
  ): void {
    this.logger.debug('leaveRoom: ' + JSON.stringify(dmRoomId));
    void client.leave(dmRoomId);
  }

  getUserIdFromCookie(cookie: string): string {
    const { accessToken } = parse(cookie);
    const { id } = this.jwt.decode(accessToken) as { id: string };

    return id;
  }
}
