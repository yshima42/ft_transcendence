import * as NestJs from '@nestjs/common';
import * as Sw from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtOtpAuthGuard } from 'src/auth/guards/jwt-otp-auth.guard';
import { ResponseDmRoom } from './dm-room.interface';
import { DmRoomService } from './dm-room.service';

@NestJs.Controller('dm/rooms')
@Sw.ApiTags('dm-room')
@NestJs.UseGuards(JwtOtpAuthGuard)
export class DmRoomController {
  constructor(private readonly dmRoomService: DmRoomService) {}

  @NestJs.Post(':userId')
  async findOneOrCreate(
    @NestJs.Param('userId', new NestJs.ParseUUIDPipe()) userId: string,
    @GetUser() user: User
  ): Promise<string> {
    const res = await this.dmRoomService.findOrCreate(userId, user.id);

    return res.id;
  }

  @NestJs.Get()
  async findAll(@GetUser() user: User): Promise<ResponseDmRoom[]> {
    return await this.dmRoomService.findAllWithoutBlockUser(user.id);
  }

  @NestJs.Get(':dmRoomId')
  async findOne(
    @NestJs.Param('dmRoomId', new NestJs.ParseUUIDPipe()) dmRoomId: string,
    @GetUser() user: User
  ): Promise<ResponseDmRoom> {
    return await this.dmRoomService.findOne(dmRoomId, user.id);
  }
}
