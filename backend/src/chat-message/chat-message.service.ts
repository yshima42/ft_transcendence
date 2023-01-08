import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseChatMessage } from './chat-message.interface';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@Injectable()
export class ChatMessageService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger('ChatMessageService');
  private readonly json = (obj: any): string => JSON.stringify(obj, null, 2);

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
    this.logger.debug(
      `create: ${this.json({ chatMessage, createChatMessageDto, senderId })}`
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
    this.logger.debug(
      `findAllNotBlocked: ${this.json({ chatMessage, chatRoomId, userId })}`
    );

    return chatMessage;
  }

  async findAllNotBlockedLimit(
    chatRoomId: string,
    userId: string,
    limit: number,
    offset: number
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
      // 最新のメッセージから取得する
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });
    // 並び替え
    chatMessage.reverse();
    this.logger.debug(
      `findAllNotBlockedLimit: ${this.json({
        chatMessage,
        chatRoomId,
        userId,
        limit,
        offset,
      })}`
    );

    return chatMessage;
  }
}
