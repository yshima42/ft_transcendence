import { Injectable } from '@nestjs/common';
import * as NestJS from '@nestjs/common';
import { ChatUserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseChatRoomUser } from './chat-room-user.interface';
import { CreateChatRoomUserDto } from './dto/create-chat-room-user.dto';
import { UpdateChatRoomUserDto } from './dto/update-chat-room-user.dto';

@Injectable()
export class ChatRoomUserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    chatRoomId: string,
    createChatRoomUserDto: CreateChatRoomUserDto,
    userId: string
  ): Promise<void> {
    const password = createChatRoomUserDto.password;
    if (password !== undefined) {
      // ChatRoomのパスワードを取得
      const chatRoom = await this.prisma.chatRoom.findUnique({
        where: {
          id: chatRoomId,
        },
        select: {
          password: true,
        },
      });
      if (chatRoom === null || chatRoom.password === null) {
        throw new NestJS.HttpException(
          'ChatRoom not found',
          NestJS.HttpStatus.NOT_FOUND
        );
      }
      // パスワードが一致しない場合はエラー
      const isPasswordMatch = await bcrypt.compare(password, chatRoom.password);
      if (!isPasswordMatch) {
        throw new NestJS.HttpException(
          'Password not match',
          NestJS.HttpStatus.BAD_REQUEST
        );
      }
    }
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
    updateChatRoomUserDto: UpdateChatRoomUserDto,
    loginUserId: string
  ): Promise<void> {
    const status = updateChatRoomUserDto.status;
    // loginUserIdのchatRoomでのステータスを取得
    const loginChatRoomUser = await this.prisma.chatRoomUser.findUnique({
      where: {
        chatRoomId_userId: {
          chatRoomId,
          userId: loginUserId,
        },
      },
    });
    if (loginChatRoomUser === null) {
      return;
    }
    // ADMIN -> すべての変更を許可
    // PROMOTER -> KICKED, BANED, MUTEDの変更を許可
    // NORMAL -> 何も変更を許可しない
    if (loginChatRoomUser.status === ChatUserStatus.NORMAL) {
      return;
    } else if (loginChatRoomUser.status === ChatUserStatus.MODERATOR) {
      if (
        status === ChatUserStatus.ADMIN ||
        status === ChatUserStatus.MODERATOR
      ) {
        return;
      }
    } else if (
      loginChatRoomUser.status === ChatUserStatus.ADMIN &&
      status === ChatUserStatus.ADMIN
    ) {
      // ADMIN -> ADMINの場合は通常の変更に加えて、自分のステータスをPROMOTERに変更する
      await this.prisma.$transaction([
        this.prisma.chatRoomUser.update({
          where: {
            chatRoomId_userId: {
              chatRoomId,
              userId,
            },
          },
          data: {
            status,
          },
        }),
        this.prisma.chatRoomUser.update({
          where: {
            chatRoomId_userId: {
              chatRoomId,
              userId: loginUserId,
            },
          },
          data: {
            status: ChatUserStatus.MODERATOR,
          },
        }),
      ]);

      return;
    }
    // KICKEDの場合は、テーブルから消去する
    if (status === ChatUserStatus.KICKED) {
      await this.prisma.chatRoomUser.delete({
        where: {
          chatRoomId_userId: {
            chatRoomId,
            userId,
          },
        },
      });

      return;
    }
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
