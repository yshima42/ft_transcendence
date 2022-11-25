import {
  Controller,
  Get,
  Param,
  Post,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileService } from 'src/file/file.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ProfileService } from './profile.service';

@Controller('profile')
@ApiTags('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly usersService: UsersService,
    private readonly fileService: FileService
  ) {}

  @Get('avatar/:filename')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'アバターの取得',
    description: 'このエンドポイントをUserのAvatarUrlに設定',
  })
  @ApiOkResponse({
    description: 'picture in binary',
  })
  streamAvatar(
    @GetUser() user: User,
    @Param('filename') filename: string
  ): StreamableFile {
    const path = `./upload/${user.id}/${filename}`;

    return this.fileService.streamFile(path);
  }

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'アバターの更新' })
  @UseInterceptors(FileInterceptor('file', FileService.multerOptions()))
  @ApiCreatedResponse({ type: UserEntity })
  // 本当はデコレータを別ファイルに分けたい。難しそうなのでとりあえずここで
  @ApiBody({
    description: 'The image to upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadAvatar(
    @GetUser() user: User,
    @UploadedFile(FileService.parseFilePipe()) file: Express.Multer.File
  ): Promise<User> {
    this.fileService.deleteOldFile(file.filename, user);

    const UpdateUserDto = {
      avatarImageUrl: `http://localhost:3000/users/${user.id}/profile/avatar/${file.filename}`,
    };

    return await this.profileService.update(user.id, UpdateUserDto);
  }
}
