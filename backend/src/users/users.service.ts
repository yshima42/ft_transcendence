import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(user: User): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { id: { not: user.id } },
    });

    return users;
  }

  findMe(user: User): User {
    return user;
  }

  async find(id: string, fields: string | undefined): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (user == null) {
      throw new BadRequestException('invalid userId');
    }

    let userDto: UserDto = {};
    if (fields === undefined) {
      userDto = user;
    } else {
      const attrs = fields.split(',');
      if (attrs.includes('id')) {
        userDto.id = user?.id;
      }
      if (attrs.includes('createdAt')) {
        userDto.createdAt = user.createdAt;
      }
      if (attrs.includes('updatedAt')) {
        userDto.updatedAt = user.updatedAt;
      }
      if (attrs.includes('name')) {
        userDto.name = user.name;
      }
      if (attrs.includes('avatarImageUrl')) {
        userDto.avatarImageUrl = user.avatarImageUrl;
      }
      if (attrs.includes('nickname')) {
        userDto.nickname = user.nickname;
      }
      if (attrs.includes('onlineStatus')) {
        userDto.onlineStatus = user.onlineStatus;
      }
    }

    return userDto;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: {
          id,
        },
        data: updateUserDto,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new BadRequestException('The nickname is already exists');
        }
      }
      throw e;
    }
  }
}
