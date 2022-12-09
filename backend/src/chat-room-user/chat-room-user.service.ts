import { Injectable } from '@nestjs/common';
// import { CreateChatRoomUserDto } from './dto/create-chat-room-user.dto';
// import { UpdateChatRoomUserDto } from './dto/update-chat-room-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseChatRoomUser } from './chat-room-user.interface';

@Injectable()
export class ChatRoomUserService {
  constructor(private readonly prisma: PrismaService) {}

  // create(createChatRoomUserDto: CreateChatRoomUserDto) {
  //   Logger.log(createChatRoomUserDto);
  //   return 'This action adds a new chatRoomUser';
  // }

  async findAll(chatRoomId: string): Promise<ResponseChatRoomUser[]> {
    const chatRoomUsers = await this.prisma.chatRoomUser.findMany({
      where: {
        chatRoomId: chatRoomId,
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

  // findOne(id: number) {
  //   return `This action returns a #${id} chatRoomUser`;
  // }

  // update(id: number, updateChatRoomUserDto: UpdateChatRoomUserDto) {
  //   Logger.log(updateChatRoomUserDto);
  //   return `This action updates a #${id} chatRoomUser`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} chatRoomUser`;
  // }
}
