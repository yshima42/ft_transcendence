import { Injectable } from '@nestjs/common';
import { FriendRequest, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';

@Injectable()
export class FriendRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(creatorId: string, receiverId: string): Promise<FriendRequest> {
    return await this.prisma.friendRequest.create({
      data: {
        creatorId,
        receiverId,
        status: 'PENDING',
      },
    });
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

  // 一つ消す
  async remove(creatorId: string, receiverId: string): Promise<FriendRequest> {
    return await this.prisma.friendRequest.delete({
      where: {
        creatorId_receiverId: {
          creatorId,
          receiverId,
        },
      },
    });
  }

  // 2つ消す
  async removeFriend(
    userId: string,
    friendId: string
  ): Promise<{ count: number }> {
    return await this.prisma.friendRequest.deleteMany({
      where: {
        OR: [
          {
            creatorId: userId,
            receiverId: friendId,
          },
          {
            creatorId: friendId,
            receiverId: userId,
          },
        ],
      },
    });
  }
}
