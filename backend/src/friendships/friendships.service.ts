import { BadRequestException, Injectable } from '@nestjs/common';
import { Relationship, RelationshipType, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRelationshipDto } from './dto/create-relationship.dto';

@Injectable()
export class FriendshipsService {
  constructor(private readonly prisma: PrismaService) {}

  async request(
    userId: string,
    peerId: string
  ): Promise<[Relationship, Relationship]> {
    const relation = await this.findByUserAndPeer(userId, peerId);

    switch (relation?.type) {
      case undefined:
        return await this.requestFriend(userId, peerId);
      case 'NONE':
        return await this.requestFriendWithNone(userId, peerId);
      case 'FRIEND':
      case 'OUTGOING':
        throw new BadRequestException('Already take action for friend-request');
      case 'INCOMING':
      default:
        throw new BadRequestException('Unexpected error in addFriend');
    }
  }

  // transactionやる
  async createRelationships(
    createRelationshipDto: CreateRelationshipDto[]
  ): Promise<[Relationship, Relationship]> {
    const rel1 = await this.create(createRelationshipDto[0]);
    const rel2 = await this.create(createRelationshipDto[1]);

    return [rel1, rel2];
  }

  async requestFriend(
    userId: string,
    peerId: string
  ): Promise<[Relationship, Relationship]> {
    const createRelationshipDto: CreateRelationshipDto[] = [
      {
        userId,
        peerId,
        type: 'OUTGOING',
        isBlocking: false,
      },
      {
        userId: peerId,
        peerId: userId,
        type: 'INCOMING',
        isBlocking: false,
      },
    ];

    return await this.createRelationships(createRelationshipDto);
  }

  async requestFriendWithNone(
    userId: string,
    peerId: string
  ): Promise<[Relationship, Relationship]> {
    const updateRelation1 = await this.updateType(userId, peerId, 'OUTGOING');
    const updateRelation2 = await this.updateType(peerId, userId, 'INCOMING');

    return [updateRelation1, updateRelation2];
  }

  async accept(
    userId: string,
    peerId: string
  ): Promise<[Relationship, Relationship]> {
    const relation = await this.findByUserAndPeer(userId, peerId);

    switch (relation?.type) {
      case undefined:
        throw new BadRequestException('Has not received friend-request');
      case 'FRIEND':
      case 'OUTGOING':
        throw new BadRequestException('Already take action for friend-request');
      case 'INCOMING':
        return await this.acceptRequest(userId, peerId);
      default:
        throw new BadRequestException('Unexpected error in addFriend');
    }
  }

  async acceptRequest(
    userId: string,
    peerId: string
  ): Promise<[Relationship, Relationship]> {
    const updateRelation1 = await this.updateType(userId, peerId, 'FRIEND');
    const updateRelation2 = await this.updateType(peerId, userId, 'FRIEND');

    return [updateRelation1, updateRelation2];
  }

  async deleteFriend(
    userId: string,
    peerId: string
  ): Promise<[Relationship, Relationship]> {
    const relation = await this.findByUserAndPeer(userId, peerId);

    switch (relation?.type) {
      case undefined:
        throw new BadRequestException(
          'You are not friend with target and do not send to friend-request'
        );
      default:
        return await this.deleteRelation(userId, peerId);
    }
  }

  async deleteRelation(
    userId: string,
    peerId: string
  ): Promise<[Relationship, Relationship]> {
    // const deleteRelation1 = await this.deleteByUserAndPeer(userId, peerId);
    // const deleteRelation2 = await this.deleteByUserAndPeer(peerId, userId);
    const deleteRelation1 = await this.updateType(userId, peerId, 'NONE');
    const deleteRelation2 = await this.updateType(peerId, userId, 'NONE');

    return [deleteRelation1, deleteRelation2];
  }

  async findOutgoing(userId: string): Promise<User[]> {
    const followingRelations = await this.prisma.relationship.findMany({
      where: { userId, type: 'OUTGOING' },
      select: {
        peer: true,
      },
    });

    return followingRelations.map((relation) => relation.peer);
  }

  async findIncoming(userId: string): Promise<User[]> {
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

  async block(
    userId: string,
    peerId: string
    // ここnullにして良いか？
  ): Promise<[Relationship, Relationship | null]> {
    const relation = await this.findByUserAndPeer(userId, peerId);

    const blockRelations: CreateRelationshipDto[] = [
      {
        userId,
        peerId,
        type: 'NONE',
        isBlocking: true,
      },
      {
        userId: peerId,
        peerId: userId,
        type: 'NONE',
        isBlocking: false,
      },
    ];

    if (relation?.isBlocking === true)
      throw new BadRequestException('Already Blocked');

    switch (relation?.type) {
      case undefined:
        return await this.createRelationships(blockRelations);
      case 'FRIEND':
      case 'OUTGOING':
      case 'INCOMING':
      case 'NONE':
      default: {
        const updateRelation = await this.updateIsBlocking(
          userId,
          peerId,
          true
        );
        // ここ相手のrelation返す必要あるか
        const peerRelation = await this.findByUserAndPeer(peerId, userId);

        return [updateRelation, peerRelation];
      }
    }
  }

  async findBlocking(userId: string): Promise<User[]> {
    const blockingRelations = await this.prisma.relationship.findMany({
      where: { userId, isBlocking: true },
      select: {
        peer: true,
      },
    });

    return blockingRelations.map((relation) => relation.peer);
  }

  async cancelBlocking(
    userId: string,
    peerId: string
  ): Promise<[Relationship, Relationship | null]> {
    const updateRelation = await this.updateIsBlocking(userId, peerId, false);
    const peerRelation = await this.findByUserAndPeer(peerId, userId);

    return [updateRelation, peerRelation];
  }

  // utils
  async updateIsBlocking(
    userId: string,
    peerId: string,
    updateIsBlocking: boolean
  ): Promise<Relationship> {
    return await this.prisma.relationship.update({
      where: {
        userId_peerId: {
          userId,
          peerId,
        },
      },
      data: {
        isBlocking: updateIsBlocking,
      },
    });
  }

  async updateType(
    userId: string,
    peerId: string,
    updateType: RelationshipType
  ): Promise<Relationship> {
    return await this.prisma.relationship.update({
      where: {
        userId_peerId: {
          userId,
          peerId,
        },
      },
      data: {
        type: updateType,
      },
    });
  }

  async create(
    createRelationshipDto: CreateRelationshipDto
  ): Promise<Relationship> {
    return await this.prisma.relationship.create({
      data: createRelationshipDto,
    });
  }

  async findByUserAndPeer(
    userId: string,
    peerId: string
  ): Promise<Relationship | null> {
    if (userId === peerId) {
      throw new BadRequestException("can't create relation with myself");
    }

    return await this.prisma.relationship.findUnique({
      where: {
        userId_peerId: {
          userId,
          peerId,
        },
      },
    });
  }

  async deleteByUserAndPeer(
    userId: string,
    peerId: string
  ): Promise<Relationship> {
    return await this.prisma.relationship.delete({
      where: {
        userId_peerId: {
          userId,
          peerId,
        },
      },
    });
  }
}
