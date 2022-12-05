import { Injectable, Logger } from '@nestjs/common';
import { ChatRoom, ChatMessage } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseChatMessage } from './chat.interface';
import { CreateChatMessageDto } from './dto/create-chat.dto';
import { UpdateChatRoomDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createChatMessageDto: CreateChatMessageDto,
    senderId: string
  ): Promise<ChatMessage> {
    const chatMessage = await this.prisma.chatMessage.create({
      data: {
        content: createChatMessageDto.content,
        chatRoomId: createChatMessageDto.chatRoomId,
        senderId,
      },
    });
    Logger.debug(`createChatMessage: ${JSON.stringify(chatMessage)}`);

    return chatMessage;
  }

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
