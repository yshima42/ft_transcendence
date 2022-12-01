import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  // Delete,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { User, DmRoom, DmMessage } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DmService } from './dm.service';
import { CreateDmMessageDto } from './dto/create-dm.dto';
// import { UpdateDmDto } from './dto/update-dm.dto';

@Controller('dm')
export class DmController {
  constructor(private readonly dmService: DmService) {}

  // create dm message
  @Post(':id')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createDmMessageDto: CreateDmMessageDto
  ): Promise<DmMessage> {
    Logger.verbose(`createDmMessageDto: ${JSON.stringify(createDmMessageDto)}`);

    return await this.dmService.create(createDmMessageDto);
  }

  // @Get()
  // findAll() {
  //   return this.dmService.findAll();
  // }

  @Get('messages/:id')
  @UseGuards(JwtAuthGuard)
  async findDmMessages(@Param('id') id: string): Promise<DmMessage[]> {
    return await this.dmService.findDmMessages(id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findMyDmRooms(@GetUser() user: User): Promise<DmRoom[]> {
    return await this.dmService.findMyDmRooms(user.id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDmDto: UpdateDmDto) {
  //   return this.dmService.update(+id, updateDmDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.dmService.remove(+id);
  // }
}
