import * as NestJs from '@nestjs/common';
import * as Schedule from '@nestjs/schedule';
import {
  ChatRoomMemberStatus,
  ChatRoomStatus,
  ChatRoomMember,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ChatRoomService } from 'src/chat-room/chat-room.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseChatRoomMember } from './chat-room-member.interface';
import { CreateChatRoomMemberDto } from './dto/create-chat-room-member.dto';
import { UpdateChatRoomMemberDto } from './dto/update-chat-room-member.dto';

@NestJs.Injectable()
export class ChatRoomMemberService {
  constructor(
    private readonly prisma: PrismaService,
    @NestJs.Inject(NestJs.forwardRef(() => ChatRoomService))
    private readonly chatRoomService: ChatRoomService
  ) {}

  private readonly logger = new NestJs.Logger('ChatRoomMemberService');
  private readonly json = (obj: any): string => JSON.stringify(obj, null, 2);

  async create(
    chatRoomId: string,
    createChatRoomMemberDto: CreateChatRoomMemberDto,
    chatLoginUserId: string
  ): Promise<ChatRoomMember> {
    this.logger.debug(
      `create: ${this.json({
        chatRoomId,
        createChatRoomMemberDto,
        chatLoginUserId,
      })}`
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
        this.logger.warn(
          `create: ${this.json({
            chatRoomId,
            createChatRoomMemberDto,
            chatLoginUserId,
          })}`
        );

        throw new NestJs.HttpException(
          'Password is incorrect',
          NestJs.HttpStatus.UNAUTHORIZED
        );
      }
    }
    // すでにメンバーの場合はそのまま返す
    const chatRoomMember = await this.prisma.chatRoomMember.findUnique({
      where: {
        chatRoomId_userId: {
          chatRoomId,
          userId: chatLoginUserId,
        },
      },
    });
    if (chatRoomMember !== null) {
      // Banされている場合はエラー
      if (chatRoomMember.memberStatus === ChatRoomMemberStatus.BANNED) {
        throw new NestJs.HttpException(
          'You are banned',
          NestJs.HttpStatus.UNAUTHORIZED
        );
      }

      return chatRoomMember;
    }

    return await this.prisma.chatRoomMember.create({
      data: {
        chatRoomId,
        userId: chatLoginUserId,
        memberStatus: ChatRoomMemberStatus.NORMAL,
      },
    });
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
    this.logger.debug(
      `findOne: ${this.json({
        chatRoomId,
        ChatLoginUserId,
      })}`
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
    this.logger.debug(
      `update: ${this.json({
        updateChatRoomMemberDto,
        chatLoginUserId,
      })}`
    );
    const { chatRoomId, memberId, memberStatus, limitTime } =
      updateChatRoomMemberDto;
    // loginUserIdのchatRoomでのステータスを取得
    const loginChatRoomMember = await this.findOne(chatRoomId, chatLoginUserId);
    // OWNER -> すべての変更を許可
    // MODERATOR -> KICKED, BANED, MUTEDDの変更を許可
    // NORMAL -> 何も変更を許可しない
    // 権限がないRequestの場合はエラー
    if (
      memberStatus === ChatRoomMemberStatus.OWNER ||
      (loginChatRoomMember.memberStatus !== ChatRoomMemberStatus.OWNER &&
        loginChatRoomMember.memberStatus !== ChatRoomMemberStatus.MODERATOR) ||
      (loginChatRoomMember.memberStatus === ChatRoomMemberStatus.MODERATOR &&
        memberStatus === ChatRoomMemberStatus.MODERATOR)
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

      default: {
        this.logger.debug(
          `update: ${this.json({
            chatRoomId,
            memberId,
            memberStatus,
            limitTime,
          })}`
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
        this.logger.debug(
          `update: ${this.json({
            res,
          })}`
        );

        return res;
      }
    }
  }

  async remove(chatRoomId: string, memberId: string): Promise<ChatRoomMember> {
    this.logger.debug(
      `remove: ${this.json({
        chatRoomId,
        memberId,
      })}`
    );
    const chatRoomMember = await this.findOne(chatRoomId, memberId);
    // ADMINは退出できない
    if (chatRoomMember.memberStatus === ChatRoomMemberStatus.OWNER) {
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
      this.logger.error(
        `remove: ${this.json({
          e,
        })}`
      );
      throw new NestJs.HttpException(
        'ChatRoomMember not found',
        NestJs.HttpStatus.NOT_FOUND
      );
    }
  }

  // 1分ごとに時限性のあるステータスをチェックする
  @Schedule.Cron('0 * * * * *')
  handleCron(): void {
    this.logger.debug(`handleCron`);
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
              this.logger.debug(
                `handleCron: ${this.json({
                  chatRoomMember,
                })}`
              );
            })
            .catch((e: Error) => {
              this.logger.error(`handleCron: ${this.json({ e })}`);
            });
        });
      })
      .catch((e: Error) => {
        this.logger.error(`handleCron: ${this.json({ e })}`);
      });
  }
}
