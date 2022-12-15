import { Controller, Get, UseGuards } from '@nestjs/common';
import * as Sw from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtTwoFactorAuthGuard } from 'src/auth/guards/jwt-two-factor-auth.guard';
import { ResponseDmRoom } from './dm-room.interface';
import { DmRoomService } from './dm-room.service';
@Controller('dm/room')
@Sw.ApiTags('dm-room')
@UseGuards(JwtTwoFactorAuthGuard)
export class DmRoomController {
  constructor(private readonly dmRoomService: DmRoomService) {}

  @Get('me')
  async findAll(@GetUser() user: User): Promise<ResponseDmRoom[]> {
    return await this.dmRoomService.findAll(user.id);
  }
}
