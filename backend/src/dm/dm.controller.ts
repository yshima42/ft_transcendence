import * as NestJs from '@nestjs/common';
import * as Sw from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtOtpAuthGuard } from 'src/auth/guards/jwt-otp-auth.guard';
import { ResponseDm } from './dm.interface';
import { DmService } from './dm.service';

@NestJs.Controller('dm/rooms/:dmRoomId/messages')
@Sw.ApiTags('dm')
@NestJs.UseGuards(JwtOtpAuthGuard)
export class DmController {
  constructor(private readonly dmService: DmService) {}

  @NestJs.Get()
  async findAllNotBlocked(
    @NestJs.Param('dmRoomId', new NestJs.ParseUUIDPipe()) dmRoomId: string,
    @GetUser() user: User
  ): Promise<ResponseDm[]> {
    return await this.dmService.findAllNotBlocked(dmRoomId, user.id);
  }
}
