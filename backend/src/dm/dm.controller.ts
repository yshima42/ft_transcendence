import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { User, Dm } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ResponseDm } from './dm.interface';
import { DmService } from './dm.service';
import { CreateDmDto } from './dto/create-dm.dto';

@Controller('dm')
export class DmController {
  constructor(private readonly dmService: DmService) {}

  // create dm message
  @Post(':id')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createDmDto: CreateDmDto,
    @GetUser() user: User
  ): Promise<Dm> {
    Logger.debug(`createDmDto: ${JSON.stringify(createDmDto)}`);

    return await this.dmService.create(createDmDto, user.id);
  }

  @Get('messages/:id')
  @UseGuards(JwtAuthGuard)
  async findDms(@Param('id') id: string): Promise<ResponseDm[]> {
    return await this.dmService.findDms(id);
  }
}
