import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ResponseDmRoom } from './dmroom.interface';
import { DmroomService } from './dmroom.service';

@Controller('dm/room')
export class DmroomController {
  constructor(private readonly dmroomService: DmroomService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findAll(@GetUser() user: User): Promise<ResponseDmRoom[]> {
    return await this.dmroomService.findAll(user.id);
  }
}
