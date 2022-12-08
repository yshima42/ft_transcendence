import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FriendRequest, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';

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
    // もし、acceptされたら、DmRoomを作成する
    // トランザクションに考慮する
    if (updateFriendRequestDto.status === 'ACCEPTED') {
      const result = await this.prisma.$transaction([
        this.prisma.friendRequest.update({
          where: {
            creatorId_receiverId: {
              creatorId: updateFriendRequestDto.creatorId,
              receiverId: updateFriendRequestDto.receiverId,
            },
          },
          data: updateFriendRequestDto,
        }),
        this.prisma.dmRoom.create({
          data: {
            dmRoomUsers: {
              create: [
                {
                  userId: updateFriendRequestDto.creatorId,
                },
                {
                  userId: updateFriendRequestDto.receiverId,
                },
              ],
            },
          },
        }),
      ]);

      return result[0];
    }

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
}
