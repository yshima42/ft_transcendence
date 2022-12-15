import { Injectable, Logger } from '@nestjs/common';
import * as NestJS from '@nestjs/common';
import { ChatRoom, ChatUserStatus, ChatRoomStatus } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseChatRoom } from './chat-room.interface';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';

@Injectable()
export class ChatRoomService {
  constructor(private readonly prisma: PrismaService) {}

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
          status:
            password === undefined
              ? ChatRoomStatus.PUBLIC
              : ChatRoomStatus.PROTECTED,
          password: hashedPassword,
          chatRoomUsers: {
            create: {
              userId,
              status: ChatUserStatus.ADMIN,
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
        chatRoomUsers: {
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
        status: true,
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
        chatRoomUsers: {
          some: {
            userId,
            status: {
              not: ChatUserStatus.BANNED,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        status: true,
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
    const chatRoomUser = await this.prisma.chatRoomUser.findUnique({
      where: {
        chatRoomId_userId: {
          chatRoomId,
          userId,
        },
      },
    });
    // もしADMINじゃなかったらエラー
    if (chatRoomUser?.status !== ChatUserStatus.ADMIN) {
      Logger.warn(`updateChatRoom: user is not admin`);

      throw new Error('User is not admin');
    }

    const chatRoom = await this.prisma.chatRoom.update({
      where: {
        id: chatRoomId,
      },
      data: {
        password: hashedPassword,
        status:
          password === undefined
            ? ChatRoomStatus.PUBLIC
            : ChatRoomStatus.PROTECTED,
      },
    });
    Logger.debug(`updateChatRoom: ${JSON.stringify(chatRoom)}`);

    return chatRoom;
  }

  // remove
  async remove(id: string): Promise<ChatRoom> {
    const chatRoom = await this.prisma.chatRoom.delete({
      where: {
        id,
      },
    });
    Logger.debug(`removeChatRoom: ${JSON.stringify(chatRoom)}`);

    return chatRoom;
  }
}
