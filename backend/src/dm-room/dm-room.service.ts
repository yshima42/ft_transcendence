import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseDmRoom } from './dm-room.interface';

@Injectable()
export class DmRoomService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string): Promise<ResponseDmRoom[]> {
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
