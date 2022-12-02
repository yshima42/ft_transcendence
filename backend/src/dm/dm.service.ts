import { Injectable, Logger } from '@nestjs/common';
import { DmMessage } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseDmRoom, ResponseDmMessage } from './dm.interface';
import { CreateDmMessageDto } from './dto/create-dm.dto';
// import { UpdateDmDto } from './dto/update-dm.dto';

@Injectable()
export class DmService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createDmMessageDto: CreateDmMessageDto,
    senderId: string
  ): Promise<DmMessage> {
    const dmMessage = await this.prisma.dmMessage.create({
      data: {
        content: createDmMessageDto.content,
        senderId,
        dmRoomId: createDmMessageDto.dmRoomId,
      },
    });

    return dmMessage;
  }

  // create(createDmDto: CreateDmDto) {
  //   return 'This action adds a new dm';
  // }
  // findAll() {
  //   return `This action returns all dm`;
  // }
  // findOne(id: number) {
  //   return `This action returns a #${id} dm`;
  // }
  async findMyDmRooms(userId: string): Promise<ResponseDmRoom[]> {
    if (userId === undefined) {
      Logger.warn(`findMyDms: userId is undefined`);

      return [];
    }

    const dmRooms = await this.prisma.dmRoom.findMany({
      where: {
        dmUsers: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
        dmUsers: {
          where: {
            userId: {
              not: userId,
            },
          },
          select: {
            user: {
              select: {
                name: true,
                avatarImageUrl: true,
              },
            },
          },
        },
        dmMessages: {
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

    return dmRooms;
  }

  async findDmMessages(id: string): Promise<ResponseDmMessage[]> {
    if (id === undefined) {
      Logger.warn(`findDmMessages: dmRoomId is undefined`);

      return [];
    }

    const dmMessages = await this.prisma.dmMessage.findMany({
      where: {
        dmRoomId: id,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        sender: {
          select: {
            name: true,
            avatarImageUrl: true,
            onlineStatus: true,
          },
        },
      },
    });
    Logger.debug(`findDmMessages: ${JSON.stringify(dmMessages)}`);

    return dmMessages;
  }
  // update(id: number, updateDmDto: UpdateDmDto) {
  //   return `This action updates a #${id} dm`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} dm`;
  // }
}
