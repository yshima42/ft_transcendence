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

  private readonly logger = new NestJs.Logger('DmRoomService');
  private readonly json = (obj: any): string => JSON.stringify(obj, null, 2);

  // ない場合はRoomを作成、ある場合はRoomを返す
  async findOrCreate(userId: string, loginUserId: string): Promise<DmRoom> {
    // ログ
    this.logger.log(
      `findOrCreate: userId=${userId}, loginUserId=${loginUserId}`
    );

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

    // すでにDMルームがあるかどうか
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

    // すでにDMルームがある場合はそのルームを返す
    if (dmRoom !== null) {
      return dmRoom;
    }

    // DMルームがない場合は作成する
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
    this.logger.log(`findOne: dmRoomId=${dmRoomId}, userId=${userId}`);
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

  // 自分がDmRoomのメンバーであるか
  async isDmRoomMember(dmRoomId: string, userId: string): Promise<boolean> {
    const dmRoom = await this.prisma.dmRoom.findFirst({
      where: {
        id: dmRoomId,
        dmRoomMembers: {
          some: {
            userId,
          },
        },
      },
    });
    if (dmRoom === null) {
      return false;
    }
    // dmRoomの自分以外のメンバーを取得
    const dmRoomMember = await this.prisma.dmRoomMember.findFirst({
      where: {
        dmRoomId,
        userId: {
          not: userId,
        },
      },
      select: {
        userId: true,
      },
    });
    if (dmRoomMember === null) {
      return false;
    }
    // 自分がメンバーをブロックしていないか
    const isBlocked = await this.prisma.block.findUnique({
      where: {
        sourceId_targetId: {
          sourceId: userId,
          targetId: dmRoomMember.userId,
        },
      },
    });

    return isBlocked === null;
  }
}
