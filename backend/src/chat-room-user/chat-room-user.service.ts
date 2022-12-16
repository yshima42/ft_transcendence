import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import * as NestJS from '@nestjs/common';
import { ChatUserStatus, ChatRoomStatus, ChatRoomUser } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as bcrypt from 'bcrypt';
import { ChatRoomService } from 'src/chat-room/chat-room.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseChatRoomUser } from './chat-room-user.interface';
import { CreateChatRoomUserDto } from './dto/create-chat-room-user.dto';
import { UpdateChatRoomUserDto } from './dto/update-chat-room-user.dto';

@Injectable()
export class ChatRoomUserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => ChatRoomService))
    private readonly chatRoomService: ChatRoomService
  ) {}

  async create(
    chatRoomId: string,
    createChatRoomUserDto: CreateChatRoomUserDto,
    userId: string
  ): Promise<ChatRoomUser> {
    Logger.debug(
      `create chatRoomId=${chatRoomId} createChatRoomUserDto=${JSON.stringify(
        createChatRoomUserDto
      )} userId=${userId}`
    );
    const chatRoomPassword = createChatRoomUserDto.chatRoomPassword;
    // chatRoomのステータスを取得
    const chatRoom = await this.chatRoomService.findOne(chatRoomId);
    if (chatRoom.status === ChatRoomStatus.PROTECTED) {
      if (chatRoomPassword === undefined || chatRoomPassword === '') {
        throw new NestJS.HttpException(
          'Password is required',
          NestJS.HttpStatus.BAD_REQUEST
        );
      }
      if (
        chatRoom.password === undefined ||
        chatRoom.password === '' ||
        chatRoom.password === null
      ) {
        throw new NestJS.HttpException(
          'Password is not set',
          NestJS.HttpStatus.BAD_REQUEST
        );
      }
      // パスワードが一致しない場合はエラー
      const isPasswordMatch = await bcrypt.compare(
        chatRoomPassword,
        chatRoom.password
      );
      if (!isPasswordMatch) {
        throw new NestJS.HttpException(
          'Password is incorrect',
          NestJS.HttpStatus.UNAUTHORIZED
        );
      }
    }

    try {
      const res = await this.prisma.chatRoomUser.create({
        data: {
          chatRoomId,
          userId,
          status: ChatUserStatus.NORMAL,
        },
      });

      return res;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new NestJS.HttpException(
            'ChatRoomUser already exists',
            NestJS.HttpStatus.CONFLICT
          );
        }
      }
      throw e;
    }
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
    // MODERATOR -> KICKED, BANED, MUTEDの変更を許可
    // NORMAL -> 何も変更を許可しない
    // 権限がないRequestの場合はエラー
    if (
      (loginChatRoomUser.status !== ChatUserStatus.ADMIN &&
        loginChatRoomUser.status !== ChatUserStatus.MODERATOR) ||
      (loginChatRoomUser.status === ChatUserStatus.MODERATOR &&
        (status === ChatUserStatus.ADMIN ||
          status === ChatUserStatus.MODERATOR))
    ) {
      throw new NestJS.HttpException(
        'Permission denied',
        NestJS.HttpStatus.FORBIDDEN
      );
    }

    switch (status) {
      // KICKEDの場合は、テーブルから消去する
      case ChatUserStatus.KICKED:
        await this.remove(chatRoomId, userId);
        break;

      // ADMIN -> ADMINの場合は変更に加えて、自分のステータスをMODERATORに変更する
      case ChatUserStatus.ADMIN:
        await this.prisma.$transaction([
          this.prisma.chatRoomUser.update({
            where: {
              chatRoomId_userId: {
                chatRoomId,
                userId,
              },
            },
            data: {
              status: ChatUserStatus.ADMIN,
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
        break;

      default: {
        let limitDate: Date | undefined;
        if (limit !== undefined) {
          // 現在時刻からlimitを足した時間を取得
          limitDate = new Date();
          const durationInMilliseconds = {
            '1m': 60 * 1000,
            '1h': 60 * 60 * 1000,
            '1d': 24 * 60 * 60 * 1000,
            '1w': 7 * 24 * 60 * 60 * 1000,
            '1M': 30 * 24 * 60 * 60 * 1000,
            unlimited: 100 * 365 * 24 * 60 * 60 * 1000,
          };
          limitDate.setMilliseconds(
            limitDate.getMilliseconds() + durationInMilliseconds[limit]
          );
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
    }
  }

  async remove(chatRoomId: string, userId: string): Promise<ChatRoomUser> {
    Logger.debug(`remove chatRoomId: ${chatRoomId}, userId: ${userId}`);
    const chatRoomUser = await this.findOne(chatRoomId, userId);
    // ADMINは退出できない
    if (chatRoomUser.status === ChatUserStatus.ADMIN) {
      throw new NestJS.HttpException(
        'Permission denied',
        NestJS.HttpStatus.FORBIDDEN
      );
    }

    try {
      return await this.prisma.chatRoomUser.delete({
        where: {
          chatRoomId_userId: {
            chatRoomId,
            userId,
          },
        },
      });
    } catch (e) {
      Logger.error(e);
      throw new NestJS.HttpException(
        'ChatRoomUser not found',
        NestJS.HttpStatus.NOT_FOUND
      );
    }
  }
}
