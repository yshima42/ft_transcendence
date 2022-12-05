import { Injectable, Logger } from '@nestjs/common';
import { Dm } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseDm } from './dm.interface';
import { CreateDmDto } from './dto/create-dm.dto';
// import { UpdateDmDto } from './dto/update-dm.dto';

@Injectable()
export class DmService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDmDto: CreateDmDto, senderId: string): Promise<Dm> {
    const dm = await this.prisma.dm.create({
      data: {
        content: createDmDto.content,
        senderId,
        dmRoomId: createDmDto.dmRoomId,
      },
    });

    return dm;
  }

  async findDms(id: string): Promise<ResponseDm[]> {
    if (id === undefined) {
      Logger.warn(`findDms: dmRoomId is undefined`);

      return [];
    }

    const dms = await this.prisma.dm.findMany({
      where: {
        dmRoomId: id,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        sender: {
          select: {
            name: true,
            avatarImageUrl: true,
            onlineStatus: true,
          },
        },
      },
    });
    Logger.debug(`findDms: ${JSON.stringify(dms)}`);

    return dms;
  }
}
