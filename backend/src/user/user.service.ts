import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
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
}
