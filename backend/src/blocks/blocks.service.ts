import { Injectable } from '@nestjs/common';
import { Block, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
// import { UpdateBlockDto } from './dto/update-block.dto';

@Injectable()
export class BlocksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(sourceId: string, targetId: string): Promise<Block> {
    return await this.prisma.block.create({
      data: {
        sourceId,
        targetId,
      },
    });
  }

  async findBlockedUsers(id: string): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: {
        blockedBy: {
          some: {
            sourceId: id,
          },
        },
      },
    });
  }

  async remove(sourceId: string, targetId: string): Promise<Block> {
    return await this.prisma.block.delete({
      where: {
        sourceId_targetId: {
          sourceId,
          targetId,
        },
      },
    });
  }
}
