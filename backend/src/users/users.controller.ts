import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';
import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { User } from '@prisma/client';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostGuard } from './guards/post.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  static readonly multerOptions = (): MulterOptions => ({
    storage: diskStorage({
      destination: (req: Request & { user?: { user?: User } }, file, cb) => {
        const dir = `./upload/${req.user?.user?.id ?? ''}/`;
        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
      },
      filename: (req: Request & { user?: { user?: User } }, file, cb) => {
        cb(null, `${req.user?.user?.name ?? ''}${extname(file.originalname)}`);
      },
    }),
  });

  static readonly parseFilePipe = (): ParseFilePipe =>
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 10000000 }),
        new FileTypeValidator({ fileType: /jpeg|png|jpg/ }),
      ],
    });

  @Post(':id/avatar')
  @UseGuards(JwtAuthGuard, PostGuard)
  @UseInterceptors(FileInterceptor('file', UsersController.multerOptions()))
  async uploadFile(
    @GetUser() user: User,
    @UploadedFile(UsersController.parseFilePipe()) file: Express.Multer.File
  ): Promise<User> {
    this.usersService.deleteOldFile(file.filename, user);

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

    return this.usersService.streamAvatar(path);
  }
}
