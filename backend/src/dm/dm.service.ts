import { Injectable, Logger } from '@nestjs/common';
import { Dm } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseDmRoom, ResponseDm } from './dm.interface';
import { CreateDmDto } from './dto/create-dm.dto';
// import { UpdateDmDto } from './dto/update-dm.dto';

@Injectable()
export class DmService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDmDto: CreateDmDto, senderId: string): Promise<Dm> {
    const dm = await this.prisma.dm.create({
      data: {
        content: createDmDto.content,
        senderId,
        dmRoomId: createDmDto.dmRoomId,
      },
    });

    return dm;
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
        dms: {
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

  async findDms(id: string): Promise<ResponseDm[]> {
    if (id === undefined) {
      Logger.warn(`findDms: dmRoomId is undefined`);

      return [];
    }

    const dms = await this.prisma.dm.findMany({
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
    Logger.debug(`findDms: ${JSON.stringify(dms)}`);

    return dms;
  }
}
