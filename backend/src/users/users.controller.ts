import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { FileService } from 'src/file/file.service';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostGuard } from './guards/post.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly fileService: FileService
  ) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async findAll(@GetUser() user: User): Promise<User[]> {
    return await this.usersService.findAll(user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMe(@GetUser() user: User): User {
    return user;
  }

  @Post(':id/avatar')
  @UseGuards(JwtAuthGuard, PostGuard)
  @UseInterceptors(FileInterceptor('file', FileService.multerOptions()))
  async uploadFile(
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
}
