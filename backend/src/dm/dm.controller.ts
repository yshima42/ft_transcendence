import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { User, DmMessage } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ResponseDmRoom, ResponseDmMessage } from './dm.interface';
import { DmService } from './dm.service';
import { CreateDmMessageDto } from './dto/create-dm.dto';

@Controller('dm')
export class DmController {
  constructor(private readonly dmService: DmService) {}

  // create dm message
  @Post(':id')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createDmMessageDto: CreateDmMessageDto,
    @GetUser() user: User
  ): Promise<DmMessage> {
    Logger.debug(`createDmMessageDto: ${JSON.stringify(createDmMessageDto)}`);

    return await this.dmService.create(createDmMessageDto, user.id);
  }

  @Get('messages/:id')
  @UseGuards(JwtAuthGuard)
  async findDmMessages(@Param('id') id: string): Promise<ResponseDmMessage[]> {
    return await this.dmService.findDmMessages(id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findMyDmRooms(@GetUser() user: User): Promise<ResponseDmRoom[]> {
    Logger.debug(`findMyDmRooms: ${JSON.stringify(user)}`);

    return await this.dmService.findMyDmRooms(user.id);
  }
}
