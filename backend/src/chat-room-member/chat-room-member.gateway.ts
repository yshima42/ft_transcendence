import * as NestJs from '@nestjs/common';
import * as WebSocket from '@nestjs/websockets';
import * as SocketIO from 'socket.io';
import { UsersService } from 'src/users/users.service';
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
    private readonly usersService: UsersService
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
    this.server.to(chatRoomId).emit('changeChatRoomMemberStatusSocket');
    void client.join(chatRoomId);
  }

  @WebSocket.SubscribeMessage('leave_room_member')
  leaveRoom(
    @WebSocket.MessageBody() chatRoomId: string,
    @WebSocket.ConnectedSocket() client: SocketIO.Socket
  ): void {
    NestJs.Logger.debug(
      `chat-room-member.gateway leaveRoom: ${JSON.stringify(chatRoomId)}`
    );
    void client.leave(chatRoomId);
  }

  // ユーザーのステータス変更
  // TODO: 入力のバリデーション
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
    const cookie = client.handshake.headers.cookie;
    if (cookie === undefined) {
      NestJs.Logger.error('cookie is undefined');

      return;
    }
    const chatLoginUserId = this.usersService.getUserIdFromCookie(cookie);
    NestJs.Logger.debug(
      `chat-room-member.gateway changeStatus: ${JSON.stringify(data, null, 2)}`
    );
    await this.chatRoomMemberService.update(
      data.chatRoomId,
      data.userId,
      data.updateChatRoomMemberDto,
      chatLoginUserId
    );
    // もし、joinしているユーザがKICKED、もしくはBANNEDの場合は、
    // そのユーザをチャットルームから抜けさせる

    NestJs.Logger.verbose('to: ' + client.id);
    const res = this.server
      .in(data.chatRoomId)
      .emit('changeChatRoomMemberStatusSocket', data); // チャットルーム内の全員に送信(自分含む)
    NestJs.Logger.debug(res);
  }
}
