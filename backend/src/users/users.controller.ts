import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  Block,
  FriendRequest,
  FriendRequestStatus,
  MatchResult,
  User,
} from '@prisma/client';
import { BlocksService } from 'src/blocks/blocks.service';
import { FileService } from 'src/file/file.service';
import { FriendRequestsService } from 'src/friend-requests/friend-requests.service';
import { GameStatsEntity } from 'src/game/entities/game-stats.entity';
import { MatchResultEntity } from 'src/game/entities/match-result.entity';
import { GameService } from 'src/game/game.service';
import { GameStats } from 'src/game/interfaces/game-stats.interface';
import { UpdateUserDto } from 'src/profile/dto/update-user.dto';
import { ProfileService } from 'src/profile/profile.service';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly fileService: FileService,
    private readonly gameService: GameService,
    private readonly profileService: ProfileService,
    private readonly blocksService: BlocksService,
    private readonly friendRequestService: FriendRequestsService
  ) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'ユーザーを全員取得', description: '細かい説明' })
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll(@GetUser() user: User): Promise<User[]> {
    return await this.usersService.findAll(user);
  }

  @Get('me/profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '自分のユーザー情報取得' })
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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '自分のユーザー情報更新' })
  @ApiCreatedResponse({ type: UserEntity })
  async update(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return await this.profileService.update(user.id, updateUserDto);
  }

  @Get(':id/profile')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserEntity })
  @ApiOperation({ summary: '他ユーザー情報取得' })
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

  @Get(':id/profile/avatar/:filename')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '他ユーザーのアバター取得' })
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

  @Get(':id/game/matches')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '他ユーザーのMatchHistory取得' })
  @ApiOkResponse({ type: MatchResultEntity, isArray: true })
  async findMatchHistory(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<MatchResult[]> {
    return await this.gameService.findMatchHistory(id);
  }

  @Get(':id/game/stats')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '他ユーザーのStats取得' })
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
  @UseGuards(JwtAuthGuard)
  async block(
    @GetUser() user: User,
    @Body('targetId', ParseUUIDPipe) targetId: string
  ): Promise<Block> {
    return await this.blocksService.create(user.id, targetId);
  }

  @Delete('me/blocks/:id')
  @UseGuards(JwtAuthGuard)
  async unblock(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) targetId: string
  ): Promise<Block> {
    return await this.blocksService.remove(user.id, targetId);
  }

  @Get('me/blocks')
  @UseGuards(JwtAuthGuard)
  async findBlockedUsers(@GetUser() user: User): Promise<User[]> {
    return await this.blocksService.findBlockedUsers(user.id);
  }

  /******************************
   * フレンド関係
   ******************************/
  @Post('me/friend-requests')
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: UserEntity })
  async sendFriendRequest(
    @GetUser() user: User,
    @Body('receiverId', ParseUUIDPipe) receiverId: string
  ): Promise<FriendRequest> {
    return await this.friendRequestService.create(user.id, receiverId);
  }

  @Patch('me/friend-requests/incoming')
  @UseGuards(JwtAuthGuard)
  async respondFriendRequest(
    @GetUser() user: User,
    @Body('creatorId', ParseUUIDPipe) creatorId: string,
    @Body('status', new ParseEnumPipe(FriendRequestStatus))
    status: FriendRequestStatus
  ): Promise<FriendRequest> {
    return await this.friendRequestService.update({
      creatorId,
      receiverId: user.id,
      status,
    });
  }

  @Delete('me/friends/:id')
  @UseGuards(JwtAuthGuard)
  async unfriend(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) friendId: string
  ): Promise<{ count: number }> {
    return await this.friendRequestService.removeFriend(user.id, friendId);
  }

  @Delete('me/friend-requests/:id')
  @UseGuards(JwtAuthGuard)
  async cancelFriendRequest(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) friendId: string
  ): Promise<FriendRequest> {
    return await this.friendRequestService.remove(user.id, friendId);
  }

  @Get('me/friends')
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: UserEntity, isArray: true })
  async findFriends(@GetUser() user: User): Promise<User[]> {
    console.log('hello');

    return await this.friendRequestService.findFriends(user.id);
  }

  @Get('me/friend-requests/outgoing')
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: UserEntity, isArray: true })
  async findOutgoingrequest(@GetUser() user: User): Promise<User[]> {
    return await this.friendRequestService.findOutgoingRequest(user.id);
  }

  @Get('me/friend-requests/incoming')
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: UserEntity, isArray: true })
  async findIncomingRequest(@GetUser() user: User): Promise<User[]> {
    console.log('hello');

    return await this.friendRequestService.findIncomingRequest(user.id);
  }
}
