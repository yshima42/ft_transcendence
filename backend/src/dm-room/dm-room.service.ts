import { Injectable } from '@nestjs/common';
import { DmRoom } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseDmRoom } from './dm-room.interface';

@Injectable()
export class DmRoomService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, loginUserId: string): Promise<DmRoom> {
    const dmRoom = await this.prisma.dmRoom.create({
      data: {
        dmRoomMembers: {
          create: [
            {
              userId: loginUserId,
            },
            {
              userId,
            },
          ],
        },
      },
    });

    return dmRoom;
  }

  async findAll(userId: string): Promise<ResponseDmRoom[]> {
    const dmRooms = await this.prisma.dmRoom.findMany({
      // ブロックしているユーザーは取得しない
      where: {
        dmRoomMembers: {
          every: {
            user: {
              blocking: {
                every: {
                  targetId: {
                    not: {
                      equals: userId,
                    },
                  },
                },
              },
            },
          },
        },
      },
      select: {
        id: true,
        dmRoomMembers: {
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
