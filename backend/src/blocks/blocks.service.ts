import { Injectable } from '@nestjs/common';
import { Block, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
// import { UpdateBlockDto } from './dto/update-block.dto';

@Injectable()
export class BlocksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(blockingId: string, blockedById: string): Promise<Block> {
    return await this.prisma.block.create({
      data: {
        blockingId,
        blockedById,
      },
    });
  }

  async findBlockedUsers(id: string): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: {
        blockedBy: {
          some: {
            blockingId: id,
          },
        },
      },
    });
  }

  async remove(blockingId: string, blockedById: string): Promise<Block> {
    return await this.prisma.block.delete({
      where: {
        blockingId_blockedById: {
          blockingId,
          blockedById,
        },
      },
    });
  }
}
