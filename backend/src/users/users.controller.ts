import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { MatchResult, User } from '@prisma/client';
import { FileService } from 'src/file/file.service';
import { GameService } from 'src/game/game.service';
import { GameStats } from 'src/game/interfaces/game-stats.interface';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly fileService: FileService,
    private readonly gameService: GameService
  ) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async findAll(@GetUser() user: User): Promise<User[]> {
    return await this.usersService.findAll(user);
  }

  @Get(':id/profile')
  @UseGuards(JwtAuthGuard)
  async find(
    @Param('id') id: string,
    @Query('fields') fields: string
  ): Promise<UserDto> {
    return await this.usersService.find(id, fields);
  }

  @Get(':id/profile/avatar/:filename')
  @UseGuards(JwtAuthGuard)
  streamAvatar(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('filename') filename: string
  ): StreamableFile {
    const path = `./upload/${id}/${filename}`;

    return this.fileService.streamFile(path);
  }

  @Get(':id/game/matches')
  @UseGuards(JwtAuthGuard)
  async findMatchHistory(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<MatchResult[]> {
    return await this.gameService.findMatchHistory(id);
  }

  @Get(':id/game/stats')
  @UseGuards(JwtAuthGuard)
  async findGameStats(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<GameStats> {
    return await this.gameService.findStats(id);
  }
}
