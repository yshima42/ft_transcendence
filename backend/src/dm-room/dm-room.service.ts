import * as NestJs from '@nestjs/common';
import { DmRoom } from '@prisma/client';
import { BlocksService } from 'src/blocks/blocks.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseDmRoom } from './dm-room.interface';

@NestJs.Injectable()
export class DmRoomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly blocksService: BlocksService
  ) {}

  // ない場合はRoomを作成、ある場合はRoomを返す
  async findOrCreate(userId: string, loginUserId: string): Promise<DmRoom> {
    // 自分自身とのDMは作成できない
    if (userId === loginUserId) {
      throw new NestJs.HttpException(
        'you cannot create dm room with yourself',
        NestJs.HttpStatus.BAD_REQUEST
      );
    }
    // ブロック関係の場合は作成できない
    // booleanだけ取り出す
    const { isUserBlocked } = await this.blocksService.isUserBlocked(
      loginUserId,
      userId
    );
    if (isUserBlocked) {
      throw new NestJs.HttpException(
        'you cannot open dm room with block relation',
        NestJs.HttpStatus.BAD_REQUEST
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
        // 自分自身が入っているルームのみ取得
        dmRoomMembers: {
          some: {
            userId,
          },
        },
        // ブロックしているユーザーは取得しない
        NOT: {
          dmRoomMembers: {
            some: {
              user: {
                blockedBy: {
                  some: {
                    sourceId: userId,
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
                id: true,
                nickname: true,
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

  async findOne(dmRoomId: string, userId: string): Promise<ResponseDmRoom> {
    if (!(await this.isDmRoomMember(dmRoomId, userId))) {
      throw new NestJs.HttpException(
        'you are not dm room member',
        NestJs.HttpStatus.BAD_REQUEST
      );
    }
    const dmRoom = await this.prisma.dmRoom.findUnique({
      where: {
        id: dmRoomId,
      },
      select: {
        id: true,
        dmRoomMembers: {
          select: {
            user: {
              select: {
                id: true,
                nickname: true,
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
    if (dmRoom === null) {
      throw new NestJs.HttpException(
        'dm room not found',
        NestJs.HttpStatus.NOT_FOUND
      );
    }

    return dmRoom;
  }

  // DmRoomのメンバーかどうか
  async isDmRoomMember(dmRoomId: string, userId: string): Promise<boolean> {
    const dmRoom = await this.prisma.dmRoom.findUnique({
      where: {
        id: dmRoomId,
      },
      select: {
        dmRoomMembers: {
          select: {
            userId: true,
          },
        },
      },
    });
    if (dmRoom === null) {
      throw new NestJs.HttpException(
        'dm room not found',
        NestJs.HttpStatus.NOT_FOUND
      );
    }

    return dmRoom.dmRoomMembers.some((dmRoomMember) => {
      return dmRoomMember.userId === userId;
    });
  }
}
