import * as NestJs from '@nestjs/common';
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
import { ChatMessageService } from './chat-message.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat',
})
export class ChatMessageGateway {
  constructor(
    private readonly chatMessageService: ChatMessageService,
    private readonly jwt: JwtService
  ) {}

  // userIdとclientを紐付けるためのMap userId -> client[]
  private readonly userIdToClientMap = new Map<string, string[]>();

  @WebSocketServer()
  server!: Server;

  // Logger関数
  private readonly logger = new NestJs.Logger('ChatMessageGateway');
  private readonly json = (obj: any): string => JSON.stringify(obj, null, 2);

  // userIdとclientを紐付ける関数
  private addClientToUserIdMap(userId: string, client: string): void {
    if (this.userIdToClientMap.has(userId)) {
      const clients = this.userIdToClientMap.get(userId);
      // すでに紐付けられている場合は、clientを追加する
      if (clients !== undefined) {
        clients.push(client);
      }
    } else {
      // まだ紐付けられていない場合は、新規にMapを作成する
      this.userIdToClientMap.set(userId, [client]);
    }
  }

  // userIdとclientの紐付けを解除する関数
  private removeClientFromUserIdMap(userId: string, client: string): void {
    if (this.userIdToClientMap.has(userId)) {
      const clients = this.userIdToClientMap.get(userId);
      if (clients !== undefined) {
        // clientを削除する
        const index = clients.indexOf(client);
        if (index > -1) {
          clients.splice(index, 1);
        }
        // clientがなくなったら、Mapから削除する
        if (clients.length === 0) {
          this.userIdToClientMap.delete(userId);
        }
      }
    }
  }

  // userIdとclientを紐付ける
  handleConnection(@ConnectedSocket() client: Socket): void {
    // mapを全部表示
    this.logger.debug(`handleConnection: ${this.json(this.userIdToClientMap)}`);
    const cookie = client.handshake.headers.cookie;
    if (cookie === undefined) {
      this.logger.warn('cookie is undefined');

      return;
    }
    const chatLoginUserId = this.getUserIdFromCookie(cookie);
    this.logger.debug(`handleConnection: ${chatLoginUserId}`);
    // userIdとclientを紐付ける
    this.addClientToUserIdMap(chatLoginUserId, client.id);
    // clientにuserIdを紐付ける
    client.data.userId = chatLoginUserId;
  }

  // userIdとclientの紐付けを解除する
  handleDisconnect(@ConnectedSocket() client: Socket): void {
    const cookie = client.handshake.headers.cookie;
    if (cookie === undefined) {
      this.logger.warn('cookie is undefined');

      return;
    }
    const chatLoginUserId = this.getUserIdFromCookie(cookie);
    this.logger.debug(`handleDisconnect: ${chatLoginUserId}`);
    // userIdとclientを紐付けを解除する
    this.removeClientFromUserIdMap(chatLoginUserId, client.id);
    // clientからuserIdを削除する
    delete client.data.userId;
  }

  @NestJs.UsePipes(new NestJs.ValidationPipe())
  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody()
    createChatMessageDto: CreateChatMessageDto,
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    const newMessage = await this.chatMessageService.create(
      createChatMessageDto,
      client.data.userId as string
    );
    this.logger.debug(`newMessage: ${this.json(newMessage)}`);
    this.server
      .in(createChatMessageDto.chatRoomId)
      .emit('receive_message', newMessage);
  }

  getUserIdFromCookie(cookie: string): string {
    const { accessToken } = parse(cookie);
    const { id } = this.jwt.decode(accessToken) as { id: string };

    return id;
  }
}
