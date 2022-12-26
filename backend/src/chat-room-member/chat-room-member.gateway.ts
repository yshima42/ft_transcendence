import * as NestJs from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as WebSocket from '@nestjs/websockets';
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

  // ChatRoomに参加したときに呼ばれる
  @WebSocket.SubscribeMessage('join_room_member')
  joinRoom(
    @WebSocket.MessageBody() chatRoomId: string,
    @WebSocket.ConnectedSocket() client: SocketIO.Socket
  ): void {
    NestJs.Logger.debug(
      `chat-room-member.gateway joinRoom: ${JSON.stringify(chatRoomId)}`
    );
    // 新メンバーが入ってきたときにも、全員に通知するためにchangeChatRoomMemberStatusSocketを叩いています
    this.server.to(chatRoomId).emit('changeChatRoomMemberStatusSocket');
    void client.join(chatRoomId);
  }

  @WebSocket.SubscribeMessage('leave_room_member')
  leaveRoom(
    @WebSocket.MessageBody() chatRoomId: string,
    @WebSocket.ConnectedSocket() client: SocketIO.Socket
  ): void {
    NestJs.Logger.debug(
      `chat-room-member.gateway leaveRoom: ${JSON.stringify(
        chatRoomId,
        null,
        2
      )}`
    );
    void client.leave(chatRoomId);
  }

  // ユーザーのステータス変更
  // TODO: 入力のバリデーション ID要素をPipeでチェックしたい。
  @WebSocket.SubscribeMessage('changeChatRoomMemberStatusSocket')
  async changeStatus(
    @WebSocket.MessageBody()
    data: {
      chatRoomId: string;
      userId: string;
      updateChatRoomMemberDto: UpdateChatRoomMemberDto;
    },
    @WebSocket.ConnectedSocket() client: SocketIO.Socket
  ): Promise<void> {
    NestJs.Logger.debug(
      `chat-room-member.gateway changeStatus: ${JSON.stringify(data, null, 2)}`
    );
    const cookie = client.handshake.headers.cookie;
    if (cookie === undefined) {
      NestJs.Logger.warn('cookie is undefined');

      return;
    }
    const chatLoginUserId = this.getUserIdFromCookie(cookie);
    await this.chatRoomMemberService.update(
      data.chatRoomId,
      data.userId,
      data.updateChatRoomMemberDto,
      chatLoginUserId
    );
    const res = this.server
      .in(data.chatRoomId)
      .emit('changeChatRoomMemberStatusSocket', data); // チャットルーム内の全員に送信(自分含む)
    NestJs.Logger.debug(
      `chat-room-member.gateway changeStatus: ${JSON.stringify(res, null, 2)}`
    );
  }

  getUserIdFromCookie(cookie: string): string {
    const { accessToken } = parse(cookie);
    const { id } = this.jwt.decode(accessToken) as { id: string };

    return id;
  }
}
