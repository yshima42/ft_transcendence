import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseDm } from './dm.interface';
import { CreateDmDto } from './dto/create-dm.dto';

@Injectable()
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

  async findAllNotBlocked(dmRoomId: string): Promise<ResponseDm[]> {
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
}
