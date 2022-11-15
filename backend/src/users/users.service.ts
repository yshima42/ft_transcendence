import { createReadStream, existsSync, unlinkSync } from 'fs';
import { extname } from 'path';
import {
  Injectable,
  StreamableFile,
  UnauthorizedException,
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

  async findOne(name: string): Promise<User> {
    const found: User | null = await this.prisma.user.findUnique({
      where: { name },
    });

    if (found === null) throw new UnauthorizedException('Name incorrect');

    return found;
  }

  async update(id: string, columns: UpdateUserColumns): Promise<User> {
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

  deleteOldFile(newFilename: string, user: User): void {
    const oldExtname = extname(user.avatarUrl);
    if (oldExtname !== extname(newFilename)) {
      const oldFilePath = `./upload/${user.id}/${user.name}${oldExtname}`;
      if (existsSync(oldFilePath)) {
        unlinkSync(oldFilePath);
      }
    }
  }
}
