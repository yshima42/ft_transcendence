import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import * as NestJs from '@nestjs/common';
import {
  ChatRoomMemberStatus,
  ChatRoomStatus,
  ChatRoomMember,
} from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as bcrypt from 'bcrypt';
import { ChatRoomService } from 'src/chat-room/chat-room.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseChatRoomMember } from './chat-room-member.interface';
import { CreateChatRoomMemberDto } from './dto/create-chat-room-member.dto';
import { UpdateChatRoomMemberDto } from './dto/update-chat-room-member.dto';

@Injectable()
export class ChatRoomMemberService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => ChatRoomService))
    private readonly chatRoomService: ChatRoomService
  ) {}

  async create(
    chatRoomId: string,
    createChatRoomMemberDto: CreateChatRoomMemberDto,
    userId: string
  ): Promise<ChatRoomMember> {
    Logger.debug(
      `create chatRoomId=${chatRoomId} createChatRoomMemberDto=${JSON.stringify(
        createChatRoomMemberDto
      )} userId=${userId}`
    );
    const chatRoomPassword = createChatRoomMemberDto.chatRoomPassword;
    // chatRoomのステータスを取得
    const chatRoom = await this.chatRoomService.findOne(chatRoomId);
    if (chatRoom.roomStatus === ChatRoomStatus.PROTECTED) {
      if (chatRoomPassword === undefined || chatRoomPassword === '') {
        throw new NestJs.HttpException(
          'Password is required',
          NestJs.HttpStatus.BAD_REQUEST
        );
      }
      if (
        chatRoom.password === undefined ||
        chatRoom.password === '' ||
        chatRoom.password === null
      ) {
        throw new NestJs.HttpException(
          'Password is not set',
          NestJs.HttpStatus.BAD_REQUEST
        );
      }
      // パスワードが一致しない場合はエラー
      const isPasswordMatch = await bcrypt.compare(
        chatRoomPassword,
        chatRoom.password
      );
      if (!isPasswordMatch) {
        throw new NestJs.HttpException(
          'Password is incorrect',
          NestJs.HttpStatus.UNAUTHORIZED
        );
      }
    }

    try {
      const res = await this.prisma.chatRoomMember.create({
        data: {
          chatRoomId,
          userId,
          memberStatus: ChatRoomMemberStatus.NORMAL,
        },
      });

      return res;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new NestJs.HttpException(
            'ChatRoomMember already exists',
            NestJs.HttpStatus.CONFLICT
          );
        }
      }
      throw e;
    }
  }

  async findAll(chatRoomId: string): Promise<ResponseChatRoomMember[]> {
    const chatRoomMembers = await this.prisma.chatRoomMember.findMany({
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
        memberStatus: true,
      },
    });

    return chatRoomMembers;
  }

  // me
  async findOne(
    chatRoomId: string,
    userId: string
  ): Promise<ResponseChatRoomMember> {
    const chatRoomMember = await this.prisma.chatRoomMember.findUnique({
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
        memberStatus: true,
      },
    });
    if (chatRoomMember === null) {
      throw new NestJs.HttpException(
        'ChatRoomMember not found',
        NestJs.HttpStatus.NOT_FOUND
      );
    }

    return chatRoomMember;
  }

  async update(
    chatRoomId: string,
    userId: string,
    updateChatRoomMemberDto: UpdateChatRoomMemberDto,
    loginUserId: string
  ): Promise<ChatRoomMember> {
    const { memberStatus, limit } = updateChatRoomMemberDto;
    // loginUserIdのchatRoomでのステータスを取得
    const loginChatRoomMember = await this.findOne(chatRoomId, loginUserId);
    // ADMIN -> すべての変更を許可
    // MODERATOR -> KICKED, BANED, MUTEDDの変更を許可
    // NORMAL -> 何も変更を許可しない
    // 権限がないRequestの場合はエラー
    if (
      (loginChatRoomMember.memberStatus !== ChatRoomMemberStatus.ADMIN &&
        loginChatRoomMember.memberStatus !== ChatRoomMemberStatus.MODERATOR) ||
      (loginChatRoomMember.memberStatus === ChatRoomMemberStatus.MODERATOR &&
        (memberStatus === ChatRoomMemberStatus.ADMIN ||
          memberStatus === ChatRoomMemberStatus.MODERATOR))
    ) {
      throw new NestJs.HttpException(
        'Permission denied',
        NestJs.HttpStatus.FORBIDDEN
      );
    }

    switch (memberStatus) {
      // KICKEDの場合は、テーブルから消去する
      case ChatRoomMemberStatus.KICKED:
        return await this.remove(chatRoomId, userId);

      // ADMIN -> ADMINの場合は変更に加えて、自分のステータスをMODERATORに変更する
      case ChatRoomMemberStatus.ADMIN: {
        const res = await this.prisma.$transaction([
          this.prisma.chatRoomMember.update({
            where: {
              chatRoomId_userId: {
                chatRoomId,
                userId,
              },
            },
            data: {
              memberStatus: ChatRoomMemberStatus.ADMIN,
            },
          }),
          this.prisma.chatRoomMember.update({
            where: {
              chatRoomId_userId: {
                chatRoomId,
                userId: loginUserId,
              },
            },
            data: {
              memberStatus: ChatRoomMemberStatus.MODERATOR,
            },
          }),
        ]);

        return res[1];
      }

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

        return await this.prisma.chatRoomMember.update({
          where: {
            chatRoomId_userId: {
              chatRoomId,
              userId,
            },
          },
          data: {
            memberStatus: updateChatRoomMemberDto.memberStatus,
            statusUntil: limitDate,
          },
        });
      }
    }
  }

  async remove(chatRoomId: string, userId: string): Promise<ChatRoomMember> {
    Logger.debug(`remove chatRoomId: ${chatRoomId}, userId: ${userId}`);
    const chatRoomMember = await this.findOne(chatRoomId, userId);
    // ADMINは退出できない
    if (chatRoomMember.memberStatus === ChatRoomMemberStatus.ADMIN) {
      throw new NestJs.HttpException(
        'Permission denied',
        NestJs.HttpStatus.FORBIDDEN
      );
    }

    try {
      return await this.prisma.chatRoomMember.delete({
        where: {
          chatRoomId_userId: {
            chatRoomId,
            userId,
          },
        },
      });
    } catch (e) {
      Logger.error(e);
      throw new NestJs.HttpException(
        'ChatRoomMember not found',
        NestJs.HttpStatus.NOT_FOUND
      );
    }
  }
}
