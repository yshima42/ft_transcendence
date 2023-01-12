import * as NestJs from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseDm } from './dm.interface';
import { CreateDmDto } from './dto/create-dm.dto';

@NestJs.Injectable()
export class DmService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createDmDto: CreateDmDto,
    senderId: string
  ): Promise<ResponseDm> {
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
            onlineStatus: true,
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
            onlineStatus: true,
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

    return dmRoom !== null;
  }
}
