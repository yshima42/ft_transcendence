import {
  Controller,
  Get,
  Post,
  Param,
  ParseUUIDPipe,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as Sw from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtOtpAuthGuard } from 'src/auth/guards/jwt-otp-auth.guard';
import { FriendRequestsService } from 'src/friend-requests/friend-requests.service';
import { ResponseDmRoom } from './dm-room.interface';
import { DmRoomService } from './dm-room.service';

@Controller('dm/rooms')
@Sw.ApiTags('dm-room')
@UseGuards(JwtOtpAuthGuard)
export class DmRoomController {
  constructor(
    private readonly dmRoomService: DmRoomService,
    private readonly friendRequestsService: FriendRequestsService
  ) {}

  @Post(':userId')
  async findOneOrCreate(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @GetUser() user: User
  ): Promise<string> {
    if (userId === user.id) {
      throw new HttpException(
        'you cannot create dm room with yourself',
        HttpStatus.BAD_REQUEST
      );
    }
    if (await this.friendRequestsService.isBlockRelation(user.id, userId)) {
      throw new HttpException(
        'you cannot create dm room with block relation',
        HttpStatus.BAD_REQUEST
      );
    }
    const res = await this.dmRoomService.findOrCreate(userId, user.id);

    return res.id;
  }

  @Get()
  async findAll(@GetUser() user: User): Promise<ResponseDmRoom[]> {
    return await this.dmRoomService.findAllWithoutBlockUser(user.id);
  }
}
