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
          every: {
            receiverId: id,
            status: 'PENDING',
          },
        },
        receiver: {
          none: {
            creatorId: id,
          },
        },
      },
    });
  }

  // 関数名あとで考える
  async findOutgoingRequest(id: string): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: {
        creator: {
          none: {
            receiverId: id,
          },
        },
        receiver: {
          every: {
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
        creator: {
          every: {
            receiverId: id,
            status: 'ACCEPTED',
          },
        },
        receiver: {
          every: {
            creatorId: id,
            status: 'ACCEPTED',
          },
        },
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
}
