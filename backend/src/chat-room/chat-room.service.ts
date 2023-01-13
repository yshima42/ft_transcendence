import * as NestJS from '@nestjs/common';
import { ChatRoom, ChatRoomMemberStatus, ChatRoomStatus } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as bcrypt from 'bcrypt';
import { ChatRoomMemberService } from 'src/chat-room-member/chat-room-member.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseChatRoom } from './chat-room.interface';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';

@NestJS.Injectable()
export class ChatRoomService {
  constructor(
    private readonly prisma: PrismaService,
    @NestJS.Inject(NestJS.forwardRef(() => ChatRoomMemberService))
    private readonly chatRoomMemberService: ChatRoomMemberService
  ) {}

  private readonly logger = new NestJS.Logger('ChatRoomService');
  private readonly json = (obj: any): string => JSON.stringify(obj, null, 2);

  async create(
    createChatroomDto: CreateChatRoomDto,
    userId: string
  ): Promise<ChatRoom> {
    const { name, password, roomStatus } = createChatroomDto;
    this.logger.debug(`create: ${this.json({ createChatroomDto, userId })}`);
    // パスワードがある場合はハッシュ化
    let hashedPassword: string | undefined;
    if (password !== undefined) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    try {
      const chatRoom = await this.prisma.chatRoom.create({
        data: {
          name,
          roomStatus,
          password: hashedPassword,
          chatRoomMembers: {
            create: {
              userId,
              memberStatus: ChatRoomMemberStatus.OWNER,
            },
          },
        },
      });
      this.logger.debug(`create: ${this.json({ chatRoom })}`);

      return chatRoom;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          this.logger.warn(`createChatRoom: chatRoom is already exists`);
          throw new NestJS.HttpException(
            'ChatRoom is already exists',
            NestJS.HttpStatus.CONFLICT
          );
        }
      }
      throw error;
    }
  }

  // 自分が入っていないチャット全部
  async findJoinableRooms(userId: string): Promise<ResponseChatRoom[]> {
    const chatRooms = await this.prisma.chatRoom.findMany({
      where: {
        // roomStatus is not ChatRoomStatus.PRIVATE
        chatRoomMembers: {
          every: {
            userId: {
              not: userId,
            },
          },
        },
        AND: {
          roomStatus: {
            not: ChatRoomStatus.PRIVATE,
          },
        },
      },
      select: {
        id: true,
        name: true,
        roomStatus: true,
        chatMessages: {
          select: {
            content: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });
    this.logger.debug(`findJoinableRooms: ${this.json({ chatRooms, userId })}`);

    return chatRooms;
  }

  // 自分が入っているチャット全部 自分のステータスがBANのものは除く
  async findJoinedRooms(userId: string): Promise<ResponseChatRoom[]> {
    const chatRooms = await this.prisma.chatRoom.findMany({
      where: {
        chatRoomMembers: {
          some: {
            userId,
            memberStatus: {
              not: ChatRoomMemberStatus.BANNED,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        roomStatus: true,
        chatMessages: {
          select: {
            content: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });
    this.logger.debug(`findJoinedRooms: ${this.json({ chatRooms, userId })}`);

    return chatRooms;
  }

  // findOne
  async findOne(chatRoomId: string): Promise<ChatRoom> {
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: {
        id: chatRoomId,
      },
    });
    if (chatRoom === null) {
      this.logger.warn(`findOneChatRoom: chatRoom is not found`);
      throw new NestJS.HttpException(
        'ChatRoom is not found',
        NestJS.HttpStatus.NOT_FOUND
      );
    }
    this.logger.debug(`findOne: ${this.json({ chatRoom })}`);

    return chatRoom;
  }

  // update
  async update(
    chatRoomId: string,
    updateChatroomDto: UpdateChatRoomDto,
    userId: string
  ): Promise<ChatRoom> {
    const { roomStatus, password } = updateChatroomDto;
    // userがOWNERでない場合、エラー
    if (!(await this.isOwner(chatRoomId, userId))) {
      throw new NestJS.HttpException(
        'User is not admin',
        NestJS.HttpStatus.FORBIDDEN
      );
    }
    let hashedPassword: string | undefined;
    if (password !== undefined) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    // userのチャットでの権限を取得
    const chatRoomMember = await this.prisma.chatRoomMember.findUnique({
      where: {
        chatRoomId_userId: {
          chatRoomId,
          userId,
        },
      },
    });
    if (chatRoomMember === null) {
      throw new NestJS.HttpException(
        'User is not in chatRoom',
        NestJS.HttpStatus.NOT_FOUND
      );
    }
    if (chatRoomMember?.memberStatus !== ChatRoomMemberStatus.OWNER) {
      throw new NestJS.HttpException(
        'User is not admin',
        NestJS.HttpStatus.FORBIDDEN
      );
    }

    const chatRoom = await this.prisma.chatRoom.update({
      where: {
        id: chatRoomId,
      },
      data: {
        password: hashedPassword,
        roomStatus,
      },
    });

    return chatRoom;
  }

  // remove
  async remove(chatRoomId: string, memberId: string): Promise<ChatRoom> {
    this.logger.debug(`remove: ${this.json({ chatRoomId, memberId })}`);
    if (!(await this.isOwner(chatRoomId, memberId))) {
      throw new NestJS.HttpException(
        'User is not admin',
        NestJS.HttpStatus.FORBIDDEN
      );
    }
    const chatRoom = await this.prisma.chatRoom.delete({
      where: {
        id: chatRoomId,
      },
    });
    this.logger.debug(`remove: ${this.json({ chatRoom })}`);

    return chatRoom;
  }

  // ChatRoomのOWNERユーザーか
  async isOwner(chatRoomId: string, userId: string): Promise<boolean> {
    const chatRoomMember = await this.prisma.chatRoomMember.findUnique({
      where: {
        chatRoomId_userId: {
          chatRoomId,
          userId,
        },
      },
    });
    if (chatRoomMember === null) {
      return false;
    }
    if (chatRoomMember.memberStatus === ChatRoomMemberStatus.OWNER) {
      return true;
    }

    return false;
  }
}
