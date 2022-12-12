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

  // me
  async findOne(
    chatRoomId: string,
    userId: string
  ): Promise<ResponseChatRoomUser> {
    const chatRoomUser = await this.prisma.chatRoomUser.findUnique({
      where: {
        chatRoomId_userId: {
          chatRoomId,
          userId,
        },
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
    if (chatRoomUser === null) {
      throw new NestJS.HttpException(
        'ChatRoomUser not found',
        NestJS.HttpStatus.NOT_FOUND
      );
    }

    return chatRoomUser;
  }

  async update(
    chatRoomId: string,
    userId: string,
    updateChatRoomUserDto: UpdateChatRoomUserDto,
    loginUserId: string
  ): Promise<void> {
    const { status, limit } = updateChatRoomUserDto;
    // loginUserIdのchatRoomでのステータスを取得
    const loginChatRoomUser = await this.findOne(chatRoomId, loginUserId);
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
    let limitDate: Date | undefined;
    if (limit !== undefined) {
      // 現在時刻からlimitを足した時間を取得
      limitDate = new Date();
      // '1m' | '1h' | '1d' | '1w' | '1M' | 'unlimited';
      switch (limit) {
        case '1m':
          limitDate.setMinutes(limitDate.getMinutes() + 1);
          break;
        case '1h':
          limitDate.setHours(limitDate.getHours() + 1);
          break;
        case '1d':
          limitDate.setDate(limitDate.getDate() + 1);
          break;
        case '1w':
          limitDate.setDate(limitDate.getDate() + 7);
          break;
        case '1M':
          limitDate.setMonth(limitDate.getMonth() + 1);
          break;
        case 'unlimited':
          limitDate.setFullYear(limitDate.getFullYear() + 100);
          break;
        default:
          break;
      }
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
        statusUntil: limitDate,
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
