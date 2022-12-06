import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseDmRoom } from './dmroom.interface';

@Injectable()
export class DmroomService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string): Promise<ResponseDmRoom[]> {
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
}