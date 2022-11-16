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

  // peer起点のisFriendsをupdateする必要がある。微妙な気がする。
  // そもそも長すぎる
  async request(userId: string, peerId: string): Promise<Relationship> {
    const relation1 = await this.prisma.relationship.create({
      data: {
        userId,
        peerId,
        type: 'OUTGOING',
      },
    });
    const _relation2 = await this.prisma.relationship.create({
      data: {
        userId: peerId,
        peerId: userId,
        type: 'INCOMING',
      },
    });

    return relation1;
  }

  async acceptRequest(userId: string, peerId: string): Promise<Relationship> {
    const relation1 = await this.prisma.relationship.update({
      where: {
        userId_peerId: {
          userId,
          peerId,
        },
      },
      data: {
        type: 'FRIEND',
      },
    });
    const _relation2 = await this.prisma.relationship.update({
      where: {
        userId_peerId: {
          userId: peerId,
          peerId: userId,
        },
      },
      data: {
        type: 'FRIEND',
      },
    });

    return relation1;
  }

  async addFriend(userId: string, peerId: string): Promise<Relationship> {
    if (userId === peerId) {
      throw new BadRequestException("can't create relation with myself");
    }
    const user = await this.prisma.relationship.findFirst({
      where: {
        userId,
        peerId,
      },
      select: {
        type: true,
      },
    });
    const relationType = user?.type;

    switch (relationType) {
      case undefined:
        return await this.request(userId, peerId);
      case 'FRIEND':
        throw new BadRequestException('Already friend with target');
      case 'INCOMING':
        return await this.acceptRequest(userId, peerId);
      case 'OUTGOING':
        throw new BadRequestException('Already send friend-request for target');
      default:
        throw new BadRequestException('Unexpected error in addFriend');
    }
  }

  async deleteRelation(userId: string, peerId: string): Promise<Relationship> {
    const deleteRelation1 = await this.prisma.relationship.delete({
      where: {
        userId_peerId: {
          userId,
          peerId,
        },
      },
    });
    const _deleteRelation2 = await this.prisma.relationship.delete({
      where: {
        userId_peerId: {
          userId: peerId,
          peerId: userId,
        },
      },
    });

    return deleteRelation1;
  }

  async deleteFriend(userId: string, peerId: string): Promise<Relationship> {
    if (userId === peerId) {
      throw new BadRequestException("can't create relation with myself");
    }
    const user = await this.prisma.relationship.findFirst({
      where: {
        userId,
        peerId,
      },
      select: {
        type: true,
      },
    });
    const relationType = user?.type;

    switch (relationType) {
      case undefined:
        throw new BadRequestException(
          'You are not friend with target and do not send to friend-request'
        );
      case 'FRIEND':
        return await this.deleteRelation(userId, peerId);
      case 'INCOMING':
        return await this.deleteRelation(userId, peerId);
      case 'OUTGOING':
        return await this.deleteRelation(userId, peerId);
      default:
        throw new BadRequestException('Unexpected error in deleteFriend');
    }
  }

  // 関数名がしっくりこない
  async findRequesting(userId: string): Promise<User[]> {
    const followingRelations = await this.prisma.relationship.findMany({
      where: { userId, type: 'OUTGOING' },
      select: {
        peer: true,
      },
    });

    return followingRelations.map((relation) => relation.peer);
  }

  async findPending(userId: string): Promise<User[]> {
    const pendingRelations = await this.prisma.relationship.findMany({
      where: { userId, type: 'INCOMING' },
      select: {
        peer: true,
      },
    });

    return pendingRelations.map((relation) => relation.peer);
  }

  async findFriends(userId: string): Promise<User[]> {
    const friendRelations = await this.prisma.relationship.findMany({
      where: { userId, type: 'FRIEND' },
      select: {
        peer: true,
      },
    });

    return friendRelations.map((relation) => relation.peer);
  }
}
