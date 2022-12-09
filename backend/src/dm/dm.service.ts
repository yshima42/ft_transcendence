import { Injectable, Logger } from '@nestjs/common';
import { Dm } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseDm } from './dm.interface';
import { CreateDmDto } from './dto/create-dm.dto';
// import { UpdateDmDto } from './dto/update-dm.dto';

@Injectable()
export class DmService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createDmDto: CreateDmDto,
    senderId: string,
    dmRoomId: string
  ): Promise<Dm> {
    const dm = await this.prisma.dm.create({
      data: {
        content: createDmDto.content,
        senderId,
        dmRoomId,
      },
    });

    return dm;
  }

  async findDms(dmRoomId: string): Promise<ResponseDm[]> {
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
