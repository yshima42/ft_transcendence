import { Injectable } from '@nestjs/common';
import { Relationship, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(user: User): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { id: { not: user.id } },
    });

    return users;
  }

  // targetUser起点のisFriendsをupdateする必要がある。微妙な気がする。
  // 自分との関係作れてそう
  async createRelationship(
    userId: string,
    targetUserId: string
  ): Promise<Relationship> {
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

    return await this.prisma.relationship.create({
      data: {
        userId,
        targetUserId,
        isFriends,
      },
    });
  }

  // 関数名がしっくりこない
  async findFollowingUsers(userId: string): Promise<User[]> {
    const followingRelations = await this.prisma.relationship.findMany({
      where: { userId, isFriends: false },
      select: {
        targetUser: true,
      },
    });

    return followingRelations.map((relation) => relation.targetUser);
  }

  async findPendingUsers(userId: string): Promise<User[]> {
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
