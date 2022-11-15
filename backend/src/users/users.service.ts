import { createReadStream } from 'fs';
import {
  BadRequestException,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserColumns } from './interfaces/update-user-columns.interface';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(user: User): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { id: { not: user.id } },
    });

    return users;
  }

  async update(
    user: User,
    id: string,
    columns: UpdateUserColumns
  ): Promise<User> {
    if (user.id !== id) {
      throw new BadRequestException('他人の情報は更新できません');
    }
    const updateUser = await this.prisma.user.update({
      where: { id },
      data: columns,
    });

    return updateUser;
  }

  streamAvatar(path: string): StreamableFile {
    const file = createReadStream(path);

    return new StreamableFile(file);
  }
}
