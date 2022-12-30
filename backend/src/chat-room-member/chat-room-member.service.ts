import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import * as NestJs from '@nestjs/common';
import * as Schedule from '@nestjs/schedule';
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
    chatLoginUserId: string
  ): Promise<ChatRoomMember> {
    Logger.debug(
      `chat-room-member.service create chatRoomId=${chatRoomId} createChatRoomMemberDto=${JSON.stringify(
        createChatRoomMemberDto,
        null,
        2
      )}
      chatLoginUserId=${chatLoginUserId}`
    );
    const enteredPassword = createChatRoomMemberDto.chatRoomPassword;
    // chatRoomのステータスを取得
    const chatRoom = await this.chatRoomService.findOne(chatRoomId);
    if (chatRoom.roomStatus === ChatRoomStatus.PROTECTED) {
      if (enteredPassword === undefined || enteredPassword === '') {
        throw new NestJs.HttpException(
          'Password is required',
          NestJs.HttpStatus.BAD_REQUEST
        );
      }
      if (chatRoom.password == null) {
        throw new NestJs.HttpException(
          'Password is not set',
          NestJs.HttpStatus.BAD_REQUEST
        );
      }
      // パスワードが一致しない場合はエラー
      const isPasswordMatch = await bcrypt.compare(
        enteredPassword,
        chatRoom.password
      );
      if (!isPasswordMatch) {
        NestJs.Logger.warn(
          `chat-room-member.service create password is incorrect
          chatRoomId=${chatRoomId}
          chatRoomPassword=${enteredPassword}
          chatRoom.password=${chatRoom.password}`
        );
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
          userId: chatLoginUserId,
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
    ChatLoginUserId: string
  ): Promise<ResponseChatRoomMember> {
    Logger.debug(
      `findOne
      chatRoomId=${chatRoomId}
      ChatLoginUserId=${ChatLoginUserId}`
    );
    const chatRoomMember = await this.prisma.chatRoomMember.findUnique({
      where: {
        chatRoomId_userId: {
          chatRoomId,
          userId: ChatLoginUserId,
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
    updateChatRoomMemberDto: UpdateChatRoomMemberDto,
    chatLoginUserId: string
  ): Promise<ChatRoomMember> {
    Logger.debug(`chat-room-member.service.ts update
    updateChatRoomMemberDto=${JSON.stringify(updateChatRoomMemberDto)}
    chatLoginUserId=${chatLoginUserId}`);
    const { chatRoomId, memberId, memberStatus, limitTime } =
      updateChatRoomMemberDto;
    // loginUserIdのchatRoomでのステータスを取得
    const loginChatRoomMember = await this.findOne(chatRoomId, chatLoginUserId);
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
        return await this.remove(chatRoomId, memberId);

      // ADMIN -> ADMINの場合は変更に加えて、自分のステータスをMODERATORに変更する
      case ChatRoomMemberStatus.ADMIN: {
        const res = await this.prisma.$transaction([
          this.prisma.chatRoomMember.update({
            where: {
              chatRoomId_userId: {
                chatRoomId,
                userId: memberId,
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
                userId: chatLoginUserId,
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
        Logger.debug(
          `chat-room-member.service.ts update default
          chatRoomId=${chatRoomId}
          memberId=${memberId}
          updateChatRoomMemberDto=${JSON.stringify(
            updateChatRoomMemberDto,
            null,
            2
          )}
          chatLoginUserId=${chatLoginUserId}`
        );

        let limitDate: Date | null = null;
        if (limitTime !== undefined && limitTime !== 'forever') {
          // 現在時刻からlimitを足した時間を取得
          limitDate = new Date();
          const durationInMilliseconds = {
            '1m': 60 * 1000,
            '1h': 60 * 60 * 1000,
            '1d': 24 * 60 * 60 * 1000,
            '1w': 7 * 24 * 60 * 60 * 1000,
            '1M': 30 * 24 * 60 * 60 * 1000,
          };
          limitDate.setMilliseconds(
            limitDate.getMilliseconds() + durationInMilliseconds[limitTime]
          );
        }

        const res = await this.prisma.chatRoomMember.update({
          where: {
            chatRoomId_userId: {
              chatRoomId,
              userId: memberId,
            },
          },
          data: {
            memberStatus: updateChatRoomMemberDto.memberStatus,
            statusUntil: limitDate,
          },
        });

        Logger.debug(
          `chat-room-member.service.ts update default res
          chatRoomId=${chatRoomId}
          memberId=${memberId}
          updateChatRoomMemberDto=${JSON.stringify(
            updateChatRoomMemberDto,
            null,
            2
          )}
          chatLoginUserId=${chatLoginUserId}
          res=${JSON.stringify(res, null, 2)}`
        );

        return res;
      }
    }
  }

  async remove(chatRoomId: string, memberId: string): Promise<ChatRoomMember> {
    Logger.debug(`remove chatRoomId: ${chatRoomId}, memberId: ${memberId}`);
    const chatRoomMember = await this.findOne(chatRoomId, memberId);
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
            userId: memberId,
          },
        },
      });
    } catch (e) {
      Logger.warn(e);
      throw new NestJs.HttpException(
        'ChatRoomMember not found',
        NestJs.HttpStatus.NOT_FOUND
      );
    }
  }

  // 1分ごとに時限性のあるステータスをチェックする
  @Schedule.Cron('0 * * * * *')
  handleCron(): void {
    Logger.debug(`chat-room-member.service.ts handleCron`);
    this.prisma.chatRoomMember
      .findMany({
        where: {
          statusUntil: {
            lt: new Date(), // 現在時刻よりも前のもの
          },
        },
      })
      .then((chatRoomMembers) => {
        chatRoomMembers.forEach((chatRoomMember) => {
          this.prisma.chatRoomMember
            .update({
              where: {
                chatRoomId_userId: {
                  chatRoomId: chatRoomMember.chatRoomId,
                  userId: chatRoomMember.userId,
                },
              },
              data: {
                memberStatus: ChatRoomMemberStatus.NORMAL,
                statusUntil: null,
              },
            })
            .finally(() => {
              Logger.debug(
                `handleCron
                  chatRoomId=${chatRoomMember.chatRoomId}
                  userId=${chatRoomMember.userId}`
              );
            })
            .catch((e) => {
              Logger.warn(e);
            });
        });
      })
      .catch((e) => {
        Logger.warn(e);
      });
  }
}
