import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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

  async request(
    userId: string,
    peerId: string
  ): Promise<[Relationship, Relationship]> {
    const createRelation1 = await this.prisma.relationship.create({
      data: {
        userId,
        peerId,
        type: 'OUTGOING',
      },
    });
    const createRelation2 = await this.prisma.relationship.create({
      data: {
        userId: peerId,
        peerId: userId,
        type: 'INCOMING',
      },
    });

    return [createRelation1, createRelation2];
  }

  async acceptRequest(
    userId: string,
    peerId: string
  ): Promise<[Relationship, Relationship]> {
    const updateRelation1 = await this.prisma.relationship.update({
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
    const updateRelation2 = await this.prisma.relationship.update({
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

    return [updateRelation1, updateRelation2];
  }

  async addFriend(
    userId: string,
    peerId: string
  ): Promise<[Relationship, Relationship]> {
    if (userId === peerId) {
      throw new BadRequestException("can't create relation with myself");
    }
    const relation = await this.prisma.relationship.findUnique({
      where: {
        userId_peerId: {
          userId,
          peerId,
        },
      },
    });

    switch (relation?.type) {
      case undefined:
        return await this.request(userId, peerId);
      case 'FRIEND':
      case 'OUTGOING':
        throw new BadRequestException('Already take action for friend-request');
      case 'INCOMING':
        return await this.acceptRequest(userId, peerId);
      default:
        throw new BadRequestException('Unexpected error in addFriend');
    }
  }

  async deleteRelation(
    userId: string,
    peerId: string
  ): Promise<[Relationship, Relationship]> {
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

    return [deleteRelation1, _deleteRelation2];
  }

  async deleteFriend(
    userId: string,
    peerId: string
  ): Promise<[Relationship, Relationship]> {
    if (userId === peerId) {
      throw new BadRequestException("can't create relation with myself");
    }
    const relation = await this.prisma.relationship.findUnique({
      where: {
        userId_peerId: {
          userId,
          peerId,
        },
      },
    });

    switch (relation?.type) {
      case undefined:
        throw new BadRequestException(
          'You are not friend with target and do not send to friend-request'
        );
      default:
        return await this.deleteRelation(userId, peerId);
    }
  }

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
