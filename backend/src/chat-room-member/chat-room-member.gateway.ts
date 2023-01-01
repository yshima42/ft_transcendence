import * as NestJs from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as WebSocket from '@nestjs/websockets';
import { ChatRoomMember } from '@prisma/client';
import { parse } from 'cookie';
import * as SocketIO from 'socket.io';
import { ChatRoomMemberService } from './chat-room-member.service';
import { UpdateChatRoomMemberDto } from './dto/update-chat-room-member.dto';

@WebSocket.WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat',
})
export class ChatRoomMemberGateway {
  constructor(
    private readonly chatRoomMemberService: ChatRoomMemberService,
    private readonly jwt: JwtService
  ) {}

  @WebSocket.WebSocketServer()
  private readonly server!: SocketIO.Server;

  private readonly logger = new NestJs.Logger('ChatRoomMemberGateway');
  private readonly json = (obj: any): string => JSON.stringify(obj, null, 2);

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
