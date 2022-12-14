import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FriendRequest, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';
import { FriendRelation } from './types/friend-relation';

@Injectable()
export class FriendRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(creatorId: string, receiverId: string): Promise<FriendRequest> {
    if (creatorId === receiverId) {
      throw new BadRequestException(
        'You cannot send a friend-request to yourself.'
      );
    }

    try {
      return await this.prisma.friendRequest.create({
        data: {
          creatorId,
          receiverId,
          status: 'PENDING',
        },
      });
    } catch (error) {
      throw new BadRequestException(
        'You have already sent a friend-request to this user.'
      );
    }
  }

  // users.serviceに移してもいいかもしれない
  // Userテーブルを使用、User[]が戻り値のため
  // 関数名あとで考える
  async findIncomingRequest(id: string): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: {
        creator: {
          some: {
            receiverId: id,
            status: 'PENDING',
          },
        },
      },
      orderBy: {
        nickname: 'asc',
      },
    });
  }

  // 関数名あとで考える
  async findOutgoingRequest(id: string): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: {
        receiver: {
          some: {
            creatorId: id,
            status: 'PENDING',
          },
        },
      },
      orderBy: {
        nickname: 'asc',
      },
    });
  }

  async findFriends(id: string): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: {
        OR: [
          {
            creator: {
              some: {
                receiverId: id,
                status: 'ACCEPTED',
              },
            },
          },
          {
            receiver: {
              some: {
                creatorId: id,
                status: 'ACCEPTED',
              },
            },
          },
        ],
      },
      orderBy: {
        nickname: 'asc',
      },
    });
  }

  async findRequestableUsers(id: string): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: {
        NOT: {
          id,
        },
        AND: [
          {
            receiver: {
              every: {
                NOT: {
                  creatorId: id,
                },
              },
            },
          },
          {
            creator: {
              every: {
                NOT: {
                  receiverId: id,
                },
              },
            },
          },
        ],
      },
    });
  }

  async update(
    updateFriendRequestDto: UpdateFriendRequestDto
  ): Promise<FriendRequest> {
    return await this.prisma.friendRequest.update({
      where: {
        creatorId_receiverId: {
          creatorId: updateFriendRequestDto.creatorId,
          receiverId: updateFriendRequestDto.receiverId,
        },
      },
      data: updateFriendRequestDto,
    });
  }

  async removeOne(
    creatorId: string,
    receiverId: string
  ): Promise<FriendRequest> {
    try {
      return await this.prisma.friendRequest.delete({
        where: {
          creatorId_receiverId: {
            creatorId,
            receiverId,
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('This user is not your friend.');
    }
  }

  // 2つのid間で送られたリクエストを削除する関数
  async removeTwo(
    user1Id: string,
    user2Id: string
  ): Promise<{ count: number }> {
    return await this.prisma.friendRequest.deleteMany({
      where: {
        OR: [
          {
            creatorId: user1Id,
            receiverId: user2Id,
          },
          {
            creatorId: user2Id,
            receiverId: user1Id,
          },
        ],
      },
    });
  }

  /**
   * 特定のユーザーからのフレンドリクエストを拒否する際に使用。
   * PENDINGになっているレコードを削除する。
   * @param userId - 自分のID
   * @param requestUserId - フレンドリクエストを送ったユーザー
   * @returns count
   */
  async removePendingRequest(
    userId: string,
    requestUserId: string
  ): Promise<{ count: number }> {
    const pendingRequests = await this.prisma.friendRequest.findMany({
      where: {
        creatorId: requestUserId,
        receiverId: userId,
        status: 'PENDING',
      },
    });

    if (pendingRequests.length === 0) {
      throw new NotFoundException('This user do not request.');
    }

    return await this.removeTwo(userId, requestUserId);
  }

  // 命名に違和感あり
  async removeBetweenFriends(
    userId: string,
    friendId: string
  ): Promise<{ count: number }> {
    const acceptedRequests = await this.prisma.friendRequest.findMany({
      where: {
        OR: [
          {
            creatorId: userId,
            receiverId: friendId,
            status: 'ACCEPTED',
          },
          {
            creatorId: friendId,
            receiverId: userId,
            status: 'ACCEPTED',
          },
        ],
      },
    });

    if (acceptedRequests.length === 0) {
      throw new NotFoundException('This user is not your friend.');
    }

    return await this.removeTwo(userId, friendId);
  }

  async getFriendRelation(
    meId: string,
    otherId: string
  ): Promise<FriendRelation> {
    const ret = await this.prisma.friendRequest.findMany({
      where: {
        OR: [
          {
            AND: [{ creatorId: meId }, { receiverId: otherId }],
          },
          {
            AND: [{ creatorId: otherId }, { receiverId: meId }],
          },
        ],
      },
    });

    let friendRelation: 'NONE' | 'ACCEPTED' | 'PENDING' | 'RECOGNITION';

    if (ret.length === 0) {
      friendRelation = 'NONE';
    } else {
      if (ret[0].status === 'ACCEPTED') {
        friendRelation = 'ACCEPTED';
      } else {
        if (ret[0].creatorId === meId) {
          friendRelation = 'PENDING';
        } else {
          friendRelation = 'RECOGNITION';
        }
      }
    }

    return { friendRelation };
  }
}
