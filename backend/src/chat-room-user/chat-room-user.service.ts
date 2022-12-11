import { Injectable } from '@nestjs/common';
import { ChatUserStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseChatRoomUser } from './chat-room-user.interface';
import { UpdateChatRoomUserDto } from './dto/update-chat-room-user.dto';

@Injectable()
export class ChatRoomUserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(chatRoomId: string, userId: string): Promise<void> {
    await this.prisma.chatRoomUser.create({
      data: {
        chatRoomId,
        userId,
        status: ChatUserStatus.NORMAL,
      },
    });
  }

  async findAll(chatRoomId: string): Promise<ResponseChatRoomUser[]> {
    const chatRoomUsers = await this.prisma.chatRoomUser.findMany({
      where: {
        chatRoomId,
      },
      select: {
        user: {
          select: {
            id: true,
            nickname: true,
            avatarImageUrl: true,
          },
        },
        status: true,
      },
    });

    return chatRoomUsers;
  }

  async update(
    chatRoomId: string,
    userId: string,
    updateChatRoomUserDto: UpdateChatRoomUserDto
  ): Promise<void> {
    await this.prisma.chatRoomUser.update({
      where: {
        chatRoomId_userId: {
          chatRoomId,
          userId,
        },
      },
      data: {
        status: updateChatRoomUserDto.status,
      },
    });
  }

  async remove(chatRoomId: string, userId: string): Promise<void> {
    await this.prisma.chatRoomUser.delete({
      where: {
        chatRoomId_userId: {
          chatRoomId,
          userId,
        },
      },
    });
  }
}
