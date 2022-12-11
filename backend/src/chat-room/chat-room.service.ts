import { Injectable, Logger } from '@nestjs/common';
import { ChatRoom, ChatUserStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseChatRoom } from './chat-room.interface';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';

@Injectable()
export class ChatRoomService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createChatroomDto: CreateChatRoomDto,
    userId: string
  ): Promise<ChatRoom> {
    const { name } = createChatroomDto;

    const chatRoom = await this.prisma.chatRoom.create({
      data: {
        name,
        chatRoomUsers: {
          create: {
            userId,
            status: ChatUserStatus.ADMIN,
          },
        },
      },
    });

    Logger.debug(`createChatRoom: ${JSON.stringify(chatRoom)}`);

    return chatRoom;
  }

  // 自分が入っていないチャット全部
  async findAll(userId: string): Promise<ResponseChatRoom[]> {
    const chatRooms = await this.prisma.chatRoom.findMany({
      where: {
        chatRoomUsers: {
          every: {
            userId: {
              not: userId,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        chatMessages: {
          select: {
            content: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });
    Logger.debug(`findAllChatRoom: ${JSON.stringify(chatRooms)}`);

    return chatRooms;
  }

  // 自分が入っているチャット全部
  async findAllByMe(userId: string): Promise<ResponseChatRoom[]> {
    const chatRooms = await this.prisma.chatRoom.findMany({
      where: {
        chatRoomUsers: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        chatMessages: {
          select: {
            content: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });
    Logger.debug(`findAllChatRoom: ${JSON.stringify(chatRooms)}`);

    return chatRooms;
  }

  async findOne(id: string): Promise<ChatRoom> {
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: {
        id,
      },
    });
    Logger.debug(`findOneChatRoom: ${JSON.stringify(chatRoom)}`);

    if (chatRoom === null) {
      Logger.warn(`findOneChatRoom: chatRoom is null`);

      throw new Error('ChatRoom not found');
    }

    return chatRoom;
  }

  // update
  async update(
    id: string,
    updateChatroomDto: UpdateChatRoomDto
  ): Promise<ChatRoom> {
    const { name } = updateChatroomDto;

    const chatRoom = await this.prisma.chatRoom.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
    Logger.debug(`updateChatRoom: ${JSON.stringify(chatRoom)}`);

    return chatRoom;
  }

  // remove
  async remove(id: string): Promise<ChatRoom> {
    const chatRoom = await this.prisma.chatRoom.delete({
      where: {
        id,
      },
    });
    Logger.debug(`removeChatRoom: ${JSON.stringify(chatRoom)}`);

    return chatRoom;
  }
}
