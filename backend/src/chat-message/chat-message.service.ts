import * as NestJs from '@nestjs/common';
import { ChatRoomMemberStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatRoomMemberService } from '../chat-room-member/chat-room-member.service';
import { ResponseChatMessage } from './chat-message.interface';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@NestJs.Injectable()
export class ChatMessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chatRoomMemberService: ChatRoomMemberService
  ) {}

  private readonly logger = new NestJs.Logger('ChatMessageService');
  private readonly json = (obj: any): string => JSON.stringify(obj, null, 2);

  async create(
    createChatMessageDto: CreateChatMessageDto,
    senderId: string
  ): Promise<ResponseChatMessage> {
    const { roomId, content } = createChatMessageDto;
    // ban || mute しているユーザーはメッセージを送信できない
    const chatRoomMember = await this.chatRoomMemberService.findOne(
      roomId,
      senderId
    );
    if (
      chatRoomMember.memberStatus === ChatRoomMemberStatus.BANNED ||
      chatRoomMember.memberStatus === ChatRoomMemberStatus.MUTED
    ) {
      // TODO ソケットなのでHttpのエラーではない
      throw new NestJs.HttpException(
        'You are banned or muted',
        NestJs.HttpStatus.BAD_REQUEST
      );
    }

    const chatMessage = await this.prisma.chatMessage.create({
      data: {
        content,
        chatRoomId: roomId,
        senderId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            name: true,
            avatarImageUrl: true,
          },
        },
      },
    });
    this.logger.debug(
      `create: ${this.json({ chatMessage, createChatMessageDto, senderId })}`
    );

    return chatMessage;
  }

  // ユーザーによってブロックされたものを除き、チャットルームですべてのチャットメッセージを見つける
  async findAllNotBlocked(
    chatRoomId: string,
    userId: string
  ): Promise<ResponseChatMessage[]> {
    const chatMessage = await this.prisma.chatMessage.findMany({
      where: {
        chatRoomId,
        // Block tableにおいて、sourceIdがuserIdでtargetIdがsenderIdのレコードがある場合、ブロックされている
        // ブロックされているUserがSenderのメッセージは除く
        NOT: {
          sender: {
            blockedBy: {
              some: {
                sourceId: userId,
              },
            },
          },
        },
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            name: true,
            avatarImageUrl: true,
          },
        },
      },
    });
    this.logger.debug(
      `findAllNotBlocked: ${this.json({ chatMessage, chatRoomId, userId })}`
    );

    return chatMessage;
  }
}
