import { createReadStream } from 'fs';
import { extname, join } from 'path';
import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  ParseFilePipe,
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
import { UpdateUserColums } from './interfaces/users.interface';
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
      destination: './upload',
      filename: (req: Request & { user: { user: User } }, file, cb): void => {
        cb(null, req.user.user.name + extname(file.originalname));
      },
    }),
  });

  static readonly parseFilePipe = (): ParseFilePipe =>
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 10000000 }),
        new FileTypeValidator({ fileType: /jpeg|png/ }),
      ],
    });

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', UsersController.multerOptions()))
  async uploadFile(
    @GetUser() user: User,
    @UploadedFile(UsersController.parseFilePipe()) file: Express.Multer.File
  ): Promise<User> {
    const updateColums: UpdateUserColums = { avatarPath: file.path };
    const updateUser = await this.usersService.update(user.id, updateColums);

    return updateUser;
  }

  @Get('avatar')
  @UseGuards(JwtAuthGuard)
  getFile(@GetUser() user: User): StreamableFile {
    if (user.avatarPath === null) {
      throw new NotFoundException();
    }
    const file = createReadStream(join(process.cwd(), user.avatarPath));

    return new StreamableFile(file);
  }
}
