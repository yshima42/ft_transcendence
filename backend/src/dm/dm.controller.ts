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
import { User, Dm } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtTwoFactorAuthGuard } from 'src/auth/guards/jwt-two-factor-auth.guard';
import { ResponseDm } from './dm.interface';
import { DmService } from './dm.service';
import { CreateDmDto } from './dto/create-dm.dto';

@Controller('dm/:dmRoomId/message')
@Sw.ApiTags('dm')
@UseGuards(JwtTwoFactorAuthGuard)
export class DmController {
  constructor(private readonly dmService: DmService) {}

  // create dm message
  @Post()
  async create(
    @Param('dmRoomId', new ParseUUIDPipe()) dmRoomId: string,
    @Body() createDmDto: CreateDmDto,
    @GetUser() user: User
  ): Promise<Dm> {
    Logger.debug(`createDmDto: ${JSON.stringify(createDmDto)}`);

    return await this.dmService.create(createDmDto, user.id, dmRoomId);
  }

  @Get()
  async findDms(@Param('dmRoomId') dmRoomId: string): Promise<ResponseDm[]> {
    return await this.dmService.findDms(dmRoomId);
  }
}
