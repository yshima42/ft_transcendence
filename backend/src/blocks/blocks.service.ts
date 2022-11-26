import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Block, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
// import { UpdateBlockDto } from './dto/update-block.dto';

@Injectable()
export class BlocksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(sourceId: string, targetId: string): Promise<Block> {
    if (sourceId === targetId) {
      throw new BadRequestException('can not block myself.');
    }
    try {
      return await this.prisma.block.create({
        data: {
          sourceId,
          targetId,
        },
      });
    } catch (error) {
      throw new BadRequestException('already blocks.');
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
      throw new NotFoundException('you did not block.');
    }
  }
}
