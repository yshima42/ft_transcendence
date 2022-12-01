import { Injectable, Logger } from '@nestjs/common';
import { DmRoom, DmMessage } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDmMessageDto } from './dto/create-dm.dto';
// import { UpdateDmDto } from './dto/update-dm.dto';

@Injectable()
export class DmService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDmMessageDto: CreateDmMessageDto): Promise<DmMessage> {
    Logger.debug(`create: ${JSON.stringify(createDmMessageDto)}`);
    const dmMessage = await this.prisma.dmMessage.create({
      data: {
        content: createDmMessageDto.content,
        senderId: createDmMessageDto.senderId,
        dmRoomId: createDmMessageDto.dmRoomId,
      },
    });

    return dmMessage;
  }

  // create(createDmDto: CreateDmDto) {
  //   return 'This action adds a new dm';
  // }
  // findAll() {
  //   return `This action returns all dm`;
  // }
  // findOne(id: number) {
  //   return `This action returns a #${id} dm`;
  // }
  async findMyDmRooms(userId: string): Promise<DmRoom[]> {
    Logger.debug(`findMyDms: ${JSON.stringify(userId)}`);
    if (userId === undefined) {
      Logger.warn(`findMyDms: userId is undefined`);

      return [];
    }

    const dmRooms = await this.prisma.dmRoom.findMany({
      where: {
        dmUsers: {
          some: {
            userId,
          },
        },
      },
      include: {
        dmUsers: true,
        dmMessages: true,
      },
    });
    Logger.debug(`findMyDms: ${JSON.stringify(dmRooms)}`);

    return dmRooms;
  }

  async findDmMessages(id: string): Promise<DmMessage[]> {
    Logger.debug(`findDmMessages: ${JSON.stringify(id)}`);
    if (id === undefined) {
      Logger.warn(`findDmMessages: dmRoomId is undefined`);

      return [];
    }

    const dmMessages = await this.prisma.dmMessage.findMany({
      where: {
        dmRoomId: id,
      },
      include: {
        sender: true,
      },
    });
    Logger.debug(`findDmMessages: ${JSON.stringify(dmMessages)}`);

    return dmMessages;
  }
  // update(id: number, updateDmDto: UpdateDmDto) {
  //   return `This action updates a #${id} dm`;
  // }
  // remove(id: number) {
  //   return `This action removes a #${id} dm`;
  // }
}
