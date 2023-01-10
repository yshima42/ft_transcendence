import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DmRoom } from '@prisma/client';
import { BlocksService } from 'src/blocks/blocks.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseDmRoom } from './dm-room.interface';

@Injectable()
export class DmRoomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly blocksService: BlocksService
  ) {}

  // ない場合はRoomを作成、ある場合はRoomを返す
  async findOrCreate(userId: string, loginUserId: string): Promise<DmRoom> {
    // 自分自身とのDMは作成できない
    if (userId === loginUserId) {
      throw new HttpException(
        'you cannot create dm room with yourself',
        HttpStatus.BAD_REQUEST
      );
    }
    // ブロック関係の場合は作成できない
    // booleanだけ取り出す
    const { isUserBlocked } = await this.blocksService.isUserBlocked(
      loginUserId,
      userId
    );
    if (isUserBlocked) {
      throw new HttpException(
        'you cannot open dm room with block relation',
        HttpStatus.BAD_REQUEST
      );
    }

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

  async findAllWithoutBlockUser(userId: string): Promise<ResponseDmRoom[]> {
    const dmRooms = await this.prisma.dmRoom.findMany({
      where: {
        // ブロックしているユーザーは取得しない
        dmRoomMembers: {
          every: {
            user: {
              blockedBy: {
                some: {
                  sourceId: userId,
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
                id: true,
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
