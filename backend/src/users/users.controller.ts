import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Block, FriendRequest, MatchResult, User } from '@prisma/client';
import { JwtOtpAuthGuard } from 'src/auth/guards/jwt-otp-auth.guard';
import { BlocksService } from 'src/blocks/blocks.service';
import { FileService } from 'src/file/file.service';
import { FriendRequestsService } from 'src/friend-requests/friend-requests.service';
import { FriendRelation } from 'src/friend-requests/interfaces/friend-relation.interface';
import { GameStatsEntity } from 'src/game/entities/game-stats.entity';
import { MatchResultEntity } from 'src/game/entities/match-result.entity';
import { GameService } from 'src/game/game.service';
import { GameStats } from 'src/game/interfaces/game-stats.interface';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { UserDto } from './dto/user.dto';
import { BlockEntity } from './entities/block.entity';
import { FriendRequestEntity } from './entities/friendRequest.entity';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
@UseGuards(JwtOtpAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly fileService: FileService,
    private readonly gameService: GameService,
    private readonly blocksService: BlocksService,
    private readonly friendRequestService: FriendRequestsService
  ) {}

  @Get('all')
  @ApiOperation({
    summary: '自分以外のユーザー情報を取得',
  })
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll(@GetUser() user: User): Promise<User[]> {
    return await this.usersService.findAll(user);
  }

  @Get('me/profile')
  @ApiOperation({
    summary: '自分のユーザー情報取得',
    description:
      'queryによって取得データを指定可(id, name, nickname, onlineStatus, createdAt, updatedAt)</br>queryが設定されていない場合は全て取得',
  })
  @ApiOkResponse({ type: UserEntity })
  @ApiQuery({
    name: 'fields',
    required: false,
  })
  async findMe(
    @GetUser() user: User,
    @Query('fields') fields: string
  ): Promise<UserDto> {
    return await this.usersService.find(user.id, fields);
  }

  @Post('me/profile')
  @ApiOperation({
    summary: '自分のユーザー情報更新',
    description:
      'bodyでavatarImageUrl, nickname, onlineStatusを設定することで自分のユーザー情報更新</br>一つずつ、全て同時に更新、共に可',
  })
  @ApiCreatedResponse({ type: UserEntity })
  async update(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return await this.usersService.update(user.id, updateUserDto);
  }

  @Get(':id/profile')
  @ApiOkResponse({ type: UserEntity })
  @ApiOperation({
    summary: '各ユーザー情報取得',
    description:
      'queryによって取得データを指定可(id, name, nickname, onlineStatus, createdAt, updatedAt)</br>queryが設定されていない場合は全て取得',
  })
  @ApiQuery({
    name: 'fields',
    required: false,
  })
  async findUser(
    @Param('id') id: string,
    @Query('fields') fields: string
  ): Promise<UserDto> {
    return await this.usersService.find(id, fields);
  }

  @Get(':id/avatar/:filename')
  @ApiOperation({
    summary: '各ユーザーのアバター取得',
    description: 'このエンドポイントを各ユーザー情報のavatarImageUrlに設定',
  })
  @ApiOkResponse({
    description: 'picture in binary',
  })
  streamAvatar(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('filename') filename: string
  ): StreamableFile {
    const path = `./upload/${id}/${filename}`;

    return this.fileService.streamFile(path);
  }

  @Get('avatar/:filename')
  @ApiOperation({
    summary: 'アバターの取得',
  })
  @ApiOkResponse({
    description: 'picture in binary',
  })
  streamMyAvatar(
    @GetUser() user: User,
    @Param('filename') filename: string
  ): StreamableFile {
    const path = `./upload/${user.id}/${filename}`;

    return this.fileService.streamFile(path);
  }

  @Post('me/avatar')
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
      avatarImageUrl: `http://localhost:3000/users/${user.id}/avatar/${file.filename}`,
    };

    return await this.usersService.update(user.id, UpdateUserDto);
  }

  @Get(':id/game/matches')
  @ApiOperation({ summary: '各ユーザーのMatchHistory取得' })
  @ApiOkResponse({ type: MatchResultEntity, isArray: true })
  async findMatchHistory(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<MatchResult[]> {
    return await this.gameService.findMatchHistory(id);
  }

  @Get(':id/game/stats')
  @ApiOperation({ summary: '各ユーザーのStats取得' })
  @ApiOkResponse({ type: GameStatsEntity })
  async findGameStats(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<GameStats> {
    return await this.gameService.findStats(id);
  }

  // 自分（ログインユーザーに関するエンドポイント)
  // meコントローラー作りたい
  // 関数多いから
  // https://github.dev/JUNNETWORKS/42-ft_transcendence
  /******************************
   * ブロック関係
   ******************************/
  @Post('me/blocks')
  @ApiOperation({ summary: 'ユーザーをブロック' })
  @ApiBody({
    description: 'ブロックするユーザーのUUIDをtargetIdとして設定',
    schema: {
      type: 'object',
      properties: {
        targetId: {
          type: 'UUID',
          example: '40e8b4b4-9b39-4b7e-8e31-78e31975d320',
        },
      },
    },
  })
  @ApiCreatedResponse({ type: BlockEntity })
  async block(
    @GetUser() user: User,
    @Body('targetId', ParseUUIDPipe) targetId: string
  ): Promise<Block> {
    return await this.blocksService.create(user.id, targetId);
  }

  @Delete('me/blocks/:id')
  @ApiOperation({
    summary: 'ユーザーのブロックを解除',
    description:
      'ブロックを解除するユーザーのUUIDをpathで渡す</br>bodyで渡さないのはメソッドがDELETEのため',
  })
  @ApiOkResponse({ type: BlockEntity })
  async unblock(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) targetId: string
  ): Promise<Block> {
    return await this.blocksService.remove(user.id, targetId);
  }

  @Get('me/blocks')
  @ApiOperation({ summary: 'ブロックしているユーザーの一覧取得' })
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findBlockedUsers(@GetUser() user: User): Promise<User[]> {
    return await this.blocksService.findBlockedUsers(user.id);
  }

  @Get('me/block-relation/:id')
  @ApiOperation({ summary: '特定のユーザーをブロックしているかどうか判定' })
  @ApiOkResponse({ type: Boolean })
  async isBlockedUser(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) targetId: string
  ): Promise<boolean> {
    return await this.blocksService.isBlockedUser(user.id, targetId);
  }

  /******************************
   * フレンド関係
   ******************************/
  @Post('me/friend-requests')
  @ApiOperation({ summary: 'フレンドリクエストの送信' })
  @ApiBody({
    description: 'フレンドリクエストを送る相手のUUIDをreceiverIdに設定',
    schema: {
      type: 'object',
      properties: {
        receiverId: {
          type: 'UUID',
          example: '40e8b4b4-9b39-4b7e-8e31-78e31975d320',
        },
      },
    },
  })
  @ApiCreatedResponse({ type: UserEntity })
  async sendFriendRequest(
    @GetUser() user: User,
    @Body('receiverId', ParseUUIDPipe) receiverId: string
  ): Promise<FriendRequest> {
    return await this.friendRequestService.create(user.id, receiverId);
  }

  @Patch('me/friend-requests/incoming')
  @ApiOperation({
    summary: 'フレンドリクエストの承認',
    description: 'フレンドリクエストが自分に来ている相手に対してのみ使用可',
  })
  @ApiBody({
    description: '',
    schema: {
      type: 'object',
      properties: {
        creatorId: {
          type: 'UUID',
          example: '21514d8b-e6af-490c-bc51-d0c7a359a267',
        },
      },
    },
  })
  @ApiOkResponse({ type: FriendRequestEntity })
  async acceptFriendRequest(
    @GetUser() user: User,
    @Body('creatorId', ParseUUIDPipe) creatorId: string
  ): Promise<FriendRequest> {
    return await this.friendRequestService.update({
      creatorId,
      receiverId: user.id,
      status: 'ACCEPTED',
    });
  }

  @Delete('me/friend-requests/incoming/:id')
  @ApiOperation({
    summary: 'フレンド申請拒否',
    description: 'フレンドリクエストが自分に来ている相手にのみ使用可</br>',
  })
  async reject(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) requestUserId: string
  ): Promise<{ count: number }> {
    return await this.friendRequestService.removePendingRequest(
      user.id,
      requestUserId
    );
  }

  // numberがレスポンスとして返ってくるのは修正するべきでは
  // 上記検討次第swagger対応予定
  @Delete('me/friends/:id')
  @ApiOperation({
    summary: 'フレンド解除',
    description: 'フレンドを解除するユーザーのUUIDをpathで渡す',
  })
  async unfriend(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) friendId: string
  ): Promise<{ count: number }> {
    return await this.friendRequestService.removeBetweenFriends(
      user.id,
      friendId
    );
  }

  // フレンドリクエストをキャンセルした場合FriendRequestが返ってくるべきなのか
  // Postmanで試すと'PENDING'が返ってくるが正しい挙動か
  // 上記検討次第swagger対応予定
  @Delete('me/friend-requests/:id')
  @ApiOperation({
    summary: 'フレンドリクエストキャンセル',
    description: 'フレンドリクエストをキャンセルするユーザーのUUIDをpathで渡す',
  })
  async cancelFriendRequest(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) friendId: string
  ): Promise<FriendRequest> {
    return await this.friendRequestService.removeOne(user.id, friendId);
  }

  @Get('me/friends')
  @ApiOperation({ summary: 'フレンド一覧取得' })
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findFriends(@GetUser() user: User): Promise<User[]> {
    return await this.friendRequestService.findFriends(user.id);
  }

  @Get('me/friend-requests/outgoing')
  @ApiOperation({
    summary: '自分から(自分→他ユーザー)のフレンドリクエスト一覧取得',
  })
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findOutgoingrequest(@GetUser() user: User): Promise<User[]> {
    return await this.friendRequestService.findOutgoingRequest(user.id);
  }

  @Get('me/friend-requests/incoming')
  @ApiOperation({
    summary: '他ユーザーから(他ユーザー→自分)のフレンドリクエスト一覧取得',
  })
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findIncomingRequest(@GetUser() user: User): Promise<User[]> {
    return await this.friendRequestService.findIncomingRequest(user.id);
  }

  @Get('me/requestable-users')
  @ApiOperation({
    summary: '自分がフレンドリクエストを送ることができるユーザー一覧取得',
  })
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findRequetableUsers(@GetUser() user: User): Promise<User[]> {
    return await this.friendRequestService.findRequestableUsers(user.id);
  }

  @Get('me/friend-relation/:id')
  @ApiOperation({
    summary: '自分から見た特定ユーザーとの関係取得',
  })
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async getFriendRelation(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) otherId: string
  ): Promise<FriendRelation> {
    return await this.friendRequestService.getFriendRelation(user.id, otherId);
  }
}
