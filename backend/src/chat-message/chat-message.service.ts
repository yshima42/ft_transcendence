import { Injectable, Logger } from '@nestjs/common';
import { ChatMessage } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseChatMessage } from './chat-message.interface';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@Injectable()
export class ChatMessageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createChatMessageDto: CreateChatMessageDto,
    chatRoomId: string,
    senderId: string
  ): Promise<ChatMessage> {
    const chatMessage = await this.prisma.chatMessage.create({
      data: {
        content: createChatMessageDto.content,
        chatRoomId,
        senderId,
      },
    });
    Logger.debug(`createChatMessage: ${JSON.stringify(chatMessage)}`);

    return chatMessage;
  }

  async findAll(chatRoomId: string): Promise<ResponseChatMessage[]> {
    Logger.debug(`findChatMessages: ${JSON.stringify(chatRoomId)}`);
    if (chatRoomId === undefined) {
      Logger.warn(`findChatMessages: chatRoomId is undefined`);

      return [];
    }
    const chatMessage = await this.prisma.chatMessage.findMany({
      where: {
        chatRoomId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        sender: {
          select: {
            name: true,
            avatarImageUrl: true,
            onlineStatus: true,
          },
        },
      },
    });
    Logger.debug(`findChatMessages: ${JSON.stringify(chatMessage)}`);

    return chatMessage;
  }
}
