import * as NestJs from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as WebSocket from '@nestjs/websockets';
import { ChatRoomMember } from '@prisma/client';
import { parse } from 'cookie';
import * as SocketIO from 'socket.io';
import { ChatMessageService } from 'src/chat-message/chat-message.service';
import { CreateChatMessageDto } from 'src/chat-message/dto/create-chat-message.dto';
import { ChatRoomMemberService } from 'src/chat-room-member/chat-room-member.service';
import { UpdateChatRoomMemberDto } from 'src/chat-room-member/dto/update-chat-room-member.dto';

@WebSocket.WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat',
})
export class ChatGateway {
  constructor(
    private readonly chatMessageService: ChatMessageService,
    private readonly chatRoomMemberService: ChatRoomMemberService,
    private readonly jwt: JwtService
  ) {}

  // userIdとclientを紐付けるためのMap userId -> client[]
  private readonly userIdToClientMap = new Map<string, string[]>();

  @WebSocket.WebSocketServer()
  server!: SocketIO.Server;

  // Logger関数
  private readonly logger = new NestJs.Logger('ChatGateway');
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
  handleConnection(@WebSocket.ConnectedSocket() client: SocketIO.Socket): void {
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
  handleDisconnect(@WebSocket.ConnectedSocket() client: SocketIO.Socket): void {
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
  @WebSocket.SubscribeMessage('send_message')
  async handleMessage(
    @WebSocket.MessageBody()
    createChatMessageDto: CreateChatMessageDto,
    @WebSocket.ConnectedSocket() client: SocketIO.Socket
  ): Promise<void> {
    this.logger.debug(`handleMessage: ${this.json(createChatMessageDto)}`);
    const newMessage = await this.chatMessageService.create(
      createChatMessageDto,
      client.data.userId as string
    );
    this.logger.debug(`newMessage: ${this.json(newMessage)}`);
    this.server
      .in(createChatMessageDto.chatRoomId)
      .emit('receive_message', newMessage);
  }

  // ChatRoomに参加したときに呼ばれる
  @WebSocket.SubscribeMessage('join_room_member')
  joinRoom(
    @WebSocket.MessageBody(new NestJs.ParseUUIDPipe())
    chatRoomId: string,
    @WebSocket.ConnectedSocket() client: SocketIO.Socket
  ): void {
    this.logger.debug(
      `joinRoom: ${this.json(chatRoomId)} ${this.json(client.id)}`
    );
    // 新メンバーが入ってきたときにも、全員に通知するためにchangeChatRoomMemberStatusSocketを叩いています
    this.server.to(chatRoomId).emit('changeChatRoomMemberStatusSocket');
    void client.join(chatRoomId);
  }

  @WebSocket.SubscribeMessage('leave_room_member')
  leaveRoom(
    @WebSocket.MessageBody(new NestJs.ParseUUIDPipe())
    chatRoomId: string,
    @WebSocket.ConnectedSocket() client: SocketIO.Socket
  ): void {
    this.logger.debug(
      `leaveRoom: ${this.json(chatRoomId)} ${this.json(client.id)}`
    );
    this.server.to(chatRoomId).emit('changeChatRoomMemberStatusSocket');
    void client.leave(chatRoomId);
  }

  // ユーザーのステータス変更
  // TODO: 入力のバリデーション ID要素をPipeでチェックしたい。
  @NestJs.UsePipes(new NestJs.ValidationPipe())
  @WebSocket.SubscribeMessage('changeChatRoomMemberStatusSocket')
  async changeStatus(
    @WebSocket.MessageBody()
    updateChatRoomMemberDto: UpdateChatRoomMemberDto,
    @WebSocket.ConnectedSocket() client: SocketIO.Socket
  ): Promise<ChatRoomMember> {
    this.logger.debug(
      `changeStatus: ${this.json(updateChatRoomMemberDto)} ${this.json(
        client.id
      )}`
    );
    const cookie = client.handshake.headers.cookie;
    if (cookie === undefined) {
      NestJs.Logger.warn('cookie is undefined');

      throw new WebSocket.WsException('cookie is undefined');
    }
    const chatLoginUserId = this.getUserIdFromCookie(cookie);
    const updatedChatRoomMember = await this.chatRoomMemberService.update(
      updateChatRoomMemberDto,
      chatLoginUserId
    );
    const res = this.server
      .in(updateChatRoomMemberDto.chatRoomId)
      .emit('changeChatRoomMemberStatusSocket', updateChatRoomMemberDto); // チャットルーム内の全員に送信(自分含む)
    this.logger.debug(`changeStatus: ${this.json(res)}`);

    return updatedChatRoomMember;
  }

  getUserIdFromCookie(cookie: string): string {
    const { accessToken } = parse(cookie);
    const { id } = this.jwt.decode(accessToken) as { id: string };

    return id;
  }
}
