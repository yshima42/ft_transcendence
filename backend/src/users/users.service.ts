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

  // あとでリファクタ
  // 登録済みのものをもう一度createしようとすると例外投げている
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

  async findFollowing(userId: string): Promise<User[]> {
    const users = await this.prisma.relationship.findMany({
      where: { userId, isFriends: false },
      select: {
        targetUser: true,
      },
    });

    const following: User[] = [];
    for (const user of users) {
      following.push(user.targetUser);
    }

    return following;
  }

  async findFollowedBy(userId: string): Promise<User[]> {
    const users = await this.prisma.relationship.findMany({
      where: { targetUserId: userId, isFriends: false },
      select: {
        user: true,
      },
    });

    const followedBy: User[] = [];
    for (const user of users) {
      followedBy.push(user.user);
    }

    return followedBy;
  }

  async findFriends(userId: string): Promise<User[]> {
    const users = await this.prisma.relationship.findMany({
      where: { userId, isFriends: true },
      select: {
        targetUser: true,
      },
    });

    const friends: User[] = [];
    for (const user of users) {
      friends.push(user.targetUser);
    }

    return friends;
  }
}
