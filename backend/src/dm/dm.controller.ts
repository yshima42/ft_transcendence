import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import * as Sw from '@nestjs/swagger';
import { JwtOtpAuthGuard } from 'src/auth/guards/jwt-otp-auth.guard';
import { ResponseDm } from './dm.interface';
import { DmService } from './dm.service';

@Controller('dm/rooms/:dmRoomId/messages')
@Sw.ApiTags('dm')
@UseGuards(JwtOtpAuthGuard)
export class DmController {
  constructor(private readonly dmService: DmService) {}

  @Get()
  async findDms(@Param('dmRoomId') dmRoomId: string): Promise<ResponseDm[]> {
    return await this.dmService.findDms(dmRoomId);
  }
}
