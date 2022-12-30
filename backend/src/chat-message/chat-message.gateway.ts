import { Logger } from '@nestjs/common';
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

  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody()
    data: {
      createChatMessageDto: CreateChatMessageDto;
      chatRoomId: string;
    },
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    const cookie = client.handshake.headers.cookie;
    if (cookie === undefined) {
      Logger.warn('cookie is undefined');

      return;
    }
    const chatLoginUserId = this.getUserIdFromCookie(cookie);
    const { createChatMessageDto, chatRoomId } = data;
    const newMessage = await this.chatMessageService.create(
      createChatMessageDto,
      chatRoomId,
      chatLoginUserId
    );
    Logger.debug(
      `chat-message.gateway.ts: handleMessage: ${JSON.stringify(
        newMessage,
        null,
        2
      )}`
    );
    this.server.in(chatRoomId).emit('receive_message', newMessage);
  }

  getUserIdFromCookie(cookie: string): string {
    const { accessToken } = parse(cookie);
    const { id } = this.jwt.decode(accessToken) as { id: string };

    return id;
  }
}
