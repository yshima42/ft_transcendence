import * as NestJs from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseDm } from './dm.interface';
import { CreateDmDto } from './dto/create-dm.dto';

@NestJs.Injectable()
export class DmService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new NestJs.Logger('ChatRoomMemberService');
  private readonly json = (obj: any): string => JSON.stringify(obj, null, 2);

  async create(
    createDmDto: CreateDmDto,
    senderId: string
  ): Promise<ResponseDm> {
    this.logger.log(
      `create: createDmDto=${this.json(createDmDto)}, senderId=${senderId}`
    );
    // 自分がDmRoomのメンバーであるか, ブロック関係の場合は作成できない
    if (!(await this.isDmRoomMember(createDmDto.roomId, senderId))) {
      throw new NestJs.ForbiddenException();
    }
    const dm = await this.prisma.dm.create({
      data: {
        content: createDmDto.content,
        senderId,
        dmRoomId: createDmDto.roomId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            nickname: true,
            avatarImageUrl: true,
          },
        },
      },
    });

    return dm;
  }

  async findAllNotBlocked(
    dmRoomId: string,
    userId: string
  ): Promise<ResponseDm[]> {
    // 自分がDmRoomのメンバーであるか
    if (!(await this.isDmRoomMember(dmRoomId, userId))) {
      throw new NestJs.ForbiddenException();
    }
    const dms = await this.prisma.dm.findMany({
      where: {
        dmRoomId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            nickname: true,
            avatarImageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });
    dms.reverse();

    return dms;
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
