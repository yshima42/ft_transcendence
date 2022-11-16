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
  async request(userId: string, targetUserId: string): Promise<Relationship> {
    const relation1 = await this.prisma.relationship.create({
      data: {
        userId,
        targetUserId,
        type: 'OUTGOING',
      },
    });
    const _relation2 = await this.prisma.relationship.create({
      data: {
        userId: targetUserId,
        targetUserId: userId,
        type: 'INCOMING',
      },
    });

    return relation1;
  }

  async acceptRequest(
    userId: string,
    targetUserId: string
  ): Promise<Relationship> {
    const relation1 = await this.prisma.relationship.update({
      where: {
        userId_targetUserId: {
          userId,
          targetUserId,
        },
      },
      data: {
        type: 'FRIEND',
      },
    });
    const _relation2 = await this.prisma.relationship.update({
      where: {
        userId_targetUserId: {
          userId: targetUserId,
          targetUserId: userId,
        },
      },
      data: {
        type: 'FRIEND',
      },
    });

    return relation1;
  }

  async addFriend(userId: string, targetUserId: string): Promise<Relationship> {
    if (userId === targetUserId) {
      throw new BadRequestException("can't create relation with myself");
    }
    const user = await this.prisma.relationship.findFirst({
      where: {
        userId,
        targetUserId,
      },
      select: {
        type: true,
      },
    });
    const relationType = user?.type;

    switch (relationType) {
      case undefined:
        return await this.request(userId, targetUserId);
      case 'FRIEND':
        throw new BadRequestException('Already friend with target');
      case 'INCOMING':
        return await this.acceptRequest(userId, targetUserId);
      case 'OUTGOING':
        throw new BadRequestException('Already send friend-request for target');
      default:
        throw new BadRequestException('Unexpected error in addFriend');
    }
  }

  // 関数名がしっくりこない
  async findRequesting(userId: string): Promise<User[]> {
    const followingRelations = await this.prisma.relationship.findMany({
      where: { userId, type: 'OUTGOING' },
      select: {
        targetUser: true,
      },
    });

    return followingRelations.map((relation) => relation.targetUser);
  }

  async findPending(userId: string): Promise<User[]> {
    const pendingRelations = await this.prisma.relationship.findMany({
      where: { userId, type: 'INCOMING' },
      select: {
        targetUser: true,
      },
    });

    return pendingRelations.map((relation) => relation.targetUser);
  }

  async findFriends(userId: string): Promise<User[]> {
    const friendRelations = await this.prisma.relationship.findMany({
      where: { userId, type: 'FRIEND' },
      select: {
        targetUser: true,
      },
    });

    return friendRelations.map((relation) => relation.targetUser);
  }
}
