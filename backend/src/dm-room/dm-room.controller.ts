import {
  Controller,
  Get,
  Post,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import * as Sw from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtOtpAuthGuard } from 'src/auth/guards/jwt-otp-auth.guard';
import { ResponseDmRoom } from './dm-room.interface';
import { DmRoomService } from './dm-room.service';

@Controller('dm/rooms')
@Sw.ApiTags('dm-room')
@UseGuards(JwtOtpAuthGuard)
export class DmRoomController {
  constructor(private readonly dmRoomService: DmRoomService) {}

  @Post(':userId')
  async create(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @GetUser() user: User
  ): Promise<string> {
    const res = await this.dmRoomService.create(userId, user.id);

    return res.id;
  }

  @Get()
  async findAll(@GetUser() user: User): Promise<ResponseDmRoom[]> {
    return await this.dmRoomService.findAll(user.id);
  }
}
