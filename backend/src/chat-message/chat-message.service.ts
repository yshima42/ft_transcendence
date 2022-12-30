import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseChatMessage } from './chat-message.interface';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@Injectable()
export class ChatMessageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createChatMessageDto: CreateChatMessageDto,
    senderId: string
  ): Promise<ResponseChatMessage> {
    const chatMessage = await this.prisma.chatMessage.create({
      data: {
        content: createChatMessageDto.content,
        chatRoomId: createChatMessageDto.chatRoomId,
        senderId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            name: true,
            avatarImageUrl: true,
          },
        },
      },
    });
    Logger.debug(
      `chat-message.service.ts: ${JSON.stringify(chatMessage, null, 2)}`
    );

    return chatMessage;
  }

  async findAllNotBlocked(
    chatRoomId: string,
    userId: string
  ): Promise<ResponseChatMessage[]> {
    const chatMessage = await this.prisma.chatMessage.findMany({
      where: {
        chatRoomId,
        // 自分がブロックしているユーザーのメッセージは取得しない
        sender: {
          blockedBy: {
            every: {
              targetId: {
                equals: userId,
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
            id: true,
            name: true,
            avatarImageUrl: true,
          },
        },
      },
    });
    Logger.debug(
      `chat-message.service.ts: ${JSON.stringify(chatMessage, null, 2)}`
    );

    return chatMessage;
  }
}
