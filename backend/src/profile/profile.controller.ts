import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileService } from 'src/file/file.service';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
@ApiTags('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly usersService: UsersService,
    private readonly fileService: FileService
  ) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  async find(
    @GetUser() user: User,
    @Query('fields') fields: string
  ): Promise<UserDto> {
    return await this.usersService.find(user.id, fields);
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  async update(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return await this.profileService.update(user.id, updateUserDto);
  }

  @Get('avatar/:filename')
  @UseGuards(JwtAuthGuard)
  streamAvatar(
    @GetUser() user: User,
    @Param('filename') filename: string
  ): StreamableFile {
    const path = `./upload/${user.id}/${filename}`;

    return this.fileService.streamFile(path);
  }

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', FileService.multerOptions()))
  async uploadAvatar(
    @GetUser() user: User,
    @UploadedFile(FileService.parseFilePipe()) file: Express.Multer.File
  ): Promise<User> {
    this.fileService.deleteOldFile(file.filename, user);

    const UpdateUserDto = {
      avatarUrl: `http://localhost:3000/users/${user.id}/profile/avatar/${file.filename}`,
    };

    return await this.profileService.update(user.id, UpdateUserDto);
  }
}
