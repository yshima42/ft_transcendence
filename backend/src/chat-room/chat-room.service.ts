import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import * as NestJS from '@nestjs/common';
import { ChatRoom, ChatRoomMemberStatus, ChatRoomStatus } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as bcrypt from 'bcrypt';
import { ChatRoomMemberService } from 'src/chat-room-member/chat-room-member.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseChatRoom } from './chat-room.interface';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';

@Injectable()
export class ChatRoomService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => ChatRoomMemberService))
    private readonly chatRoomMemberService: ChatRoomMemberService
  ) {}

  async create(
    createChatroomDto: CreateChatRoomDto,
    userId: string
  ): Promise<Omit<ChatRoom, 'password'>> {
    const { name, password } = createChatroomDto;
    Logger.debug(`createChatRoom: ${JSON.stringify(createChatroomDto)}`);

    let hashedPassword: string | undefined;
    if (password !== undefined) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    try {
      const chatRoom = await this.prisma.chatRoom.create({
        data: {
          name,
          roomStatus:
            password === undefined
              ? ChatRoomStatus.PUBLIC
              : ChatRoomStatus.PROTECTED,
          password: hashedPassword,
          chatRoomMembers: {
            create: {
              userId,
              memberStatus: ChatRoomMemberStatus.ADMIN,
            },
          },
        },
      });
      Logger.debug(`createChatRoom: ${JSON.stringify(chatRoom)}`);

      return chatRoom;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          Logger.warn(`createChatRoom: chatRoom is already exists`);
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
  async findAllWithOutMe(userId: string): Promise<ResponseChatRoom[]> {
    const chatRooms = await this.prisma.chatRoom.findMany({
      where: {
        chatRoomMembers: {
          every: {
            userId: {
              not: userId,
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
    Logger.debug(`findAllChatRoom: ${JSON.stringify(chatRooms)}`);

    return chatRooms;
  }

  // 自分が入っているチャット全部 自分のステータスがBANのものは除く
  async findAllByMe(userId: string): Promise<ResponseChatRoom[]> {
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
    Logger.debug(`findAllChatRoom: ${JSON.stringify(chatRooms)}`);

    return chatRooms;
  }

  // findOne
  async findOne(chatRoomId: string): Promise<ChatRoom> {
    Logger.debug(`chat-room.service: findOne: ${chatRoomId}`);
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: {
        id: chatRoomId,
      },
    });
    if (chatRoom === null) {
      Logger.warn(`findOneChatRoom: chatRoom is not found`);
      throw new NestJS.HttpException(
        'ChatRoom is not found',
        NestJS.HttpStatus.NOT_FOUND
      );
    }
    Logger.debug(`findOneChatRoom: ${JSON.stringify(chatRoom, null, 2)}`);

    return chatRoom;
  }

  // update
  async update(
    chatRoomId: string,
    updateChatroomDto: UpdateChatRoomDto,
    userId: string
  ): Promise<ChatRoom> {
    const { password } = updateChatroomDto;
    Logger.debug(`updateChatRoom: ${JSON.stringify(updateChatroomDto)}`);
    let hashedPassword: string | undefined;
    if (password !== undefined) {
      Logger.debug(`updateChatRoom: password is not undefined`);
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
    // もしADMINじゃなかったらエラー
    if (chatRoomMember?.memberStatus !== ChatRoomMemberStatus.ADMIN) {
      Logger.warn(`updateChatRoom: user is not admin`);

      throw new Error('User is not admin');
    }

    const chatRoom = await this.prisma.chatRoom.update({
      where: {
        id: chatRoomId,
      },
      data: {
        password: hashedPassword,
        roomStatus:
          password === undefined
            ? ChatRoomStatus.PUBLIC
            : ChatRoomStatus.PROTECTED,
      },
    });
    Logger.debug(`updateChatRoom: ${JSON.stringify(chatRoom)}`);

    return chatRoom;
  }

  // remove
  async remove(chatRoomId: string, memberId: string): Promise<ChatRoom> {
    Logger.debug(
      `chat-room.service.ts: removeChatRoom: ${chatRoomId} ${memberId}`
    );
    // userのチャットでの権限を取得
    const loginChatRoomMember = await this.chatRoomMemberService.findOne(
      chatRoomId,
      memberId
    );
    if (loginChatRoomMember === undefined) {
      Logger.warn(`removeChatRoom: user is not in chatRoom`);

      throw new NestJS.HttpException(
        'User is not in chatRoom',
        NestJS.HttpStatus.NOT_FOUND
      );
    }
    // もしADMINじゃなかったらエラー
    if (loginChatRoomMember.memberStatus !== ChatRoomMemberStatus.ADMIN) {
      Logger.warn(`removeChatRoom: user is not admin`);

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
    Logger.debug(`removeChatRoom: ${JSON.stringify(chatRoom)}`);

    return chatRoom;
  }
}
