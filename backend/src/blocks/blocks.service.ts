import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Block, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BlocksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(sourceId: string, targetId: string): Promise<Block> {
    if (sourceId === targetId) {
      throw new BadRequestException('You cannot block yourself.');
    }
    try {
      return await this.prisma.block.create({
        data: {
          sourceId,
          targetId,
        },
      });
    } catch (error) {
      throw new BadRequestException('You have already blocked this user.');
    }
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
      orderBy: {
        nickname: 'asc',
      },
    });
  }

  async remove(sourceId: string, targetId: string): Promise<Block> {
    try {
      return await this.prisma.block.delete({
        where: {
          sourceId_targetId: {
            sourceId,
            targetId,
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('You have not blocked this user.');
    }
  }

  async isUserBlocked(
    sourceId: string,
    targetId: string
  ): Promise<{ isUserBlocked: boolean }> {
    const ret = await this.prisma.block.findUnique({
      where: {
        sourceId_targetId: {
          sourceId,
          targetId,
        },
      },
    });

    return { isUserBlocked: ret !== null };
  }
}
