import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ResponseDmRoom } from './dm-room.interface';
import { DmRoomService } from './dm-room.service';

@Controller('dm/room')
export class DmRoomController {
  constructor(private readonly dmRoomService: DmRoomService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findAll(@GetUser() user: User): Promise<ResponseDmRoom[]> {
    return await this.dmRoomService.findAll(user.id);
  }
}
