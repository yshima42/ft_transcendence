import { Injectable, Logger } from '@nestjs/common';
import { ChatRoom, ChatMessage } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatRoomDto } from './dto/create-chat.dto';
import { UpdateChatRoomDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createChatRoomDto: CreateChatRoomDto): Promise<ChatRoom> {
    const { name } = createChatRoomDto;

    return await this.prisma.chatRoom.create({
      data: {
        name,
      },
    });
  }

  // findAll() {
  //   return `This action returns all chat`;
  // }

  // findOne(id: string) {
  //   return `This action returns a #${id} chat`;
  // }

  async update(
    id: string,
    updateChatRoomDto: UpdateChatRoomDto
  ): Promise<ChatRoom> {
    const { name } = updateChatRoomDto;

    return await this.prisma.chatRoom.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  }

  async remove(id: string): Promise<ChatRoom> {
    return await this.prisma.chatRoom.delete({
      where: {
        id,
      },
    });
  }

  async findChatMessages(id: string): Promise<ChatMessage[]> {
    Logger.debug(`findChatMessages: ${JSON.stringify(id)}`);
    if (id === undefined) {
      Logger.warn(`findChatMessages: chatRoomId is undefined`);

      return [];
    }
    const chatMessage = await this.prisma.chatMessage.findMany({
      where: {
        id,
      },
    });
    Logger.debug(`findChatMessages: ${JSON.stringify(chatMessage)}`);

    return chatMessage;
  }
}
