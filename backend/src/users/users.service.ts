import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserColums } from './interfaces/users.interface';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(user: User): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { id: { not: user.id } },
    });

    return users;
  }

  async update(id: string, colums: UpdateUserColums): Promise<User> {
    console.log(colums);

    const updateUser = await this.prisma.user.update({
      where: { id },
      data: colums,
    });

    return updateUser;
  }
}
