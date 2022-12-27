import { Injectable } from '@nestjs/common';
import { DmRoom } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseDmRoom } from './dm-room.interface';

@Injectable()
export class DmRoomService {
  constructor(private readonly prisma: PrismaService) {}

  // ない場合はRoomを作成、ある場合はRoomを返す
  async findOrCreate(userId: string, loginUserId: string): Promise<DmRoom> {
    const dmRoom = await this.prisma.dmRoom.findFirst({
      where: {
        dmRoomMembers: {
          every: {
            userId: {
              in: [userId, loginUserId],
            },
          },
        },
      },
    });

    if (dmRoom !== null) {
      return dmRoom;
    }

    return await this.prisma.dmRoom.create({
      data: {
        dmRoomMembers: {
          create: [
            {
              userId,
            },
            {
              userId: loginUserId,
            },
          ],
        },
      },
    });
  }

  // ブロックしているユーザーは取得しない
  async findAllWithoutBlockUser(userId: string): Promise<ResponseDmRoom[]> {
    const dmRooms = await this.prisma.dmRoom.findMany({
      // ブロックしているユーザーは取得しない
      where: {
        dmRoomMembers: {
          every: {
            user: {
              blocking: {
                every: {
                  sourceId: {
                    not: {
                      equals: userId,
                    },
                  },
                },
              },
            },
          },
        },
        // 自分自身が入っているルームのみ取得
        AND: {
          dmRoomMembers: {
            some: {
              userId,
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
