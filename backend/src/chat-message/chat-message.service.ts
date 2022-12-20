import { Injectable, Logger } from '@nestjs/common';
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
  ): Promise<ResponseChatMessage> {
    const chatMessage = await this.prisma.chatMessage.create({
      data: {
        content: createChatMessageDto.content,
        chatRoomId,
        senderId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        sender: {
          select: {
            name: true,
            avatarImageUrl: true,
          },
        },
      },
    });
    Logger.debug(`createChatMessage: ${JSON.stringify(chatMessage)}`);

    return chatMessage;
  }

  async findAllNotBlocked(
    chatRoomId: string,
    userId: string
  ): Promise<ResponseChatMessage[]> {
    Logger.debug(`findChatMessages: ${JSON.stringify(chatRoomId)}`);
    const chatMessage = await this.prisma.chatMessage.findMany({
      where: {
        chatRoomId,
        // ブロックしているユーザーのメッセージは取得しない
        sender: {
          blocking: {
            every: {
              targetId: {
                not: {
                  equals: userId,
                },
              },
            },
          },
        },
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        sender: {
          select: {
            name: true,
            avatarImageUrl: true,
          },
        },
      },
    });
    Logger.debug(`findChatMessages: ${JSON.stringify(chatMessage)}`);

    return chatMessage;
  }
}
