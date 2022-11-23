import { Injectable } from '@nestjs/common';
import { FriendRequest } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
// import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';

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

  // findAll() {
  //   return `This action returns all friendRequests`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} friendRequest`;
  // }

  // update(id: number, updateFriendRequestDto: UpdateFriendRequestDto) {
  //   return `This action updates a #${id} friendRequest`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} friendRequest`;
  // }
}
