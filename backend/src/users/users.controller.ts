import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MatchResult, User } from '@prisma/client';
import { FileService } from 'src/file/file.service';
import { GameService } from 'src/game/game.service';
import { GameStats } from 'src/game/interfaces/game-stats.interface';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDto } from './dto/user.dto';
import { PostGuard } from './guards/post.guard';
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

  @Post(':id/avatar')
  @UseGuards(JwtAuthGuard, PostGuard)
  @UseInterceptors(FileInterceptor('file', FileService.multerOptions()))
  async uploadAvatar(
    @GetUser() user: User,
    @UploadedFile(FileService.parseFilePipe()) file: Express.Multer.File
  ): Promise<User> {
    this.fileService.deleteOldFile(file.filename, user);

    const updateColumns = {
      avatarUrl: `http://localhost:3000/users/${user.id}/avatar/${file.filename}`,
    };

    return await this.usersService.update(user.id, updateColumns);
  }

  @Get(':id/avatar/:filename')
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
