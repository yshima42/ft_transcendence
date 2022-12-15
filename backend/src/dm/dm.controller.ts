import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Logger,
  ParseUUIDPipe,
} from '@nestjs/common';
import * as Sw from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtOtpAuthGuard } from 'src/auth/guards/jwt-otp-auth.guard';
import { ResponseDm } from './dm.interface';
import { DmService } from './dm.service';
import { CreateDmDto } from './dto/create-dm.dto';

@Controller('dm/rooms/:dmRoomId/messages')
@Sw.ApiTags('dm')
@UseGuards(JwtOtpAuthGuard)
export class DmController {
  constructor(private readonly dmService: DmService) {}

  // create dm message
  @Post()
  async create(
    @Param('dmRoomId', new ParseUUIDPipe()) dmRoomId: string,
    @Body() createDmDto: CreateDmDto,
    @GetUser() user: User
  ): Promise<ResponseDm> {
    Logger.debug(`createDmDto: ${JSON.stringify(createDmDto)}`);

    return await this.dmService.create(createDmDto, user.id, dmRoomId);
  }

  @Get()
  async findDms(@Param('dmRoomId') dmRoomId: string): Promise<ResponseDm[]> {
    return await this.dmService.findDms(dmRoomId);
  }
}
