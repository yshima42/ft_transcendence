import { BadRequestException, Injectable } from '@nestjs/common';
import { Relationship, User } from '@prisma/client';
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

  async update(id: string, columns: UpdateUserColumns): Promise<User> {
    const updateUser = await this.prisma.user.update({
      where: { id },
      data: columns,
    });

    return updateUser;
  }

  // targetUser起点のisFriendsをupdateする必要がある。微妙な気がする。
  // そもそも長すぎる
  async addFriend(userId: string, targetUserId: string): Promise<Relationship> {
    if (userId === targetUserId) {
      throw new BadRequestException("can't create relation with myself");
    }
    const isFollowdBy = await this.prisma.relationship.findUnique({
      where: {
        userId_targetUserId: {
          userId: targetUserId,
          targetUserId: userId,
        },
      },
    });

    const isFriends = isFollowdBy != null;
    if (isFriends) {
      await this.prisma.relationship.update({
        where: {
          userId_targetUserId: {
            userId: targetUserId,
            targetUserId: userId,
          },
        },
        data: {
          isFriends: true,
        },
      });
    }

    try {
      return await this.prisma.relationship.create({
        data: {
          userId,
          targetUserId,
          isFriends,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        'relation already exists. or something wrong'
      );
    }
  }

  // 関数名がしっくりこない
  async findRequesting(userId: string): Promise<User[]> {
    const followingRelations = await this.prisma.relationship.findMany({
      where: { userId, isFriends: false },
      select: {
        targetUser: true,
      },
    });

    return followingRelations.map((relation) => relation.targetUser);
  }

  async findPending(userId: string): Promise<User[]> {
    const pendingRelations = await this.prisma.relationship.findMany({
      where: { targetUserId: userId, isFriends: false },
      select: {
        user: true,
      },
    });

    return pendingRelations.map((relation) => relation.user);
  }

  async findFriends(userId: string): Promise<User[]> {
    const friendRelations = await this.prisma.relationship.findMany({
      where: { userId, isFriends: true },
      select: {
        targetUser: true,
      },
    });

    return friendRelations.map((relation) => relation.targetUser);
  }
}
