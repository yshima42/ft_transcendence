import { Injectable, Logger } from '@nestjs/common';
import { ChatRoom } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseChatRoom } from './chatroom.interface';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';

@Injectable()
export class ChatroomService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createChatroomDto: CreateChatroomDto): Promise<ChatRoom> {
    const { name } = createChatroomDto;

    const chatRoom = await this.prisma.chatRoom.create({
      data: {
        name,
      },
    });
    Logger.debug(`createChatRoom: ${JSON.stringify(chatRoom)}`);

    return chatRoom;
  }

  async findAll(): Promise<ResponseChatRoom[]> {
    const chatRooms = await this.prisma.chatRoom.findMany({
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
    updateChatroomDto: UpdateChatroomDto
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
