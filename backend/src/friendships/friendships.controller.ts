import {
  Body,
  Controller,
  Delete,
  Get,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Relationship, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FriendshipsService } from './friendships.service';

@Controller('friendships')
export class FriendshipsController {
  constructor(private readonly friendShipsService: FriendshipsService) {}

  @Post('request')
  @UseGuards(JwtAuthGuard)
  async addFriend(
    @GetUser() user: User,
    @Body('peerId', ParseUUIDPipe) peerId: string
  ): Promise<[Relationship, Relationship]> {
    return await this.friendShipsService.request(user.id, peerId);
  }

  @Post('accept')
  @UseGuards(JwtAuthGuard)
  async acceptFriend(
    @GetUser() user: User,
    @Body('peerId', ParseUUIDPipe) peerId: string
  ): Promise<[Relationship, Relationship]> {
    return await this.friendShipsService.accept(user.id, peerId);
  }

  @Delete('destroy')
  @UseGuards(JwtAuthGuard)
  async deleteFriend(
    @GetUser() user: User,
    @Body('peerId', ParseUUIDPipe) peerId: string
  ): Promise<[Relationship, Relationship]> {
    return await this.friendShipsService.deleteFriend(user.id, peerId);
  }

  @Delete('cancel')
  @UseGuards(JwtAuthGuard)
  async cancelFriend(
    @GetUser() user: User,
    @Body('peerId', ParseUUIDPipe) peerId: string
  ): Promise<[Relationship, Relationship]> {
    return await this.friendShipsService.deleteFriend(user.id, peerId);
  }

  @Delete('reject')
  @UseGuards(JwtAuthGuard)
  async rejectFriend(
    @GetUser() user: User,
    @Body('peerId', ParseUUIDPipe) peerId: string
  ): Promise<[Relationship, Relationship]> {
    return await this.friendShipsService.deleteFriend(user.id, peerId);
  }

  @Get('outgoing')
  @UseGuards(JwtAuthGuard)
  async findOutgoing(@GetUser() user: User): Promise<User[]> {
    return await this.friendShipsService.findOutgoing(user.id);
  }

  @Get('incoming')
  @UseGuards(JwtAuthGuard)
  async findIncoming(@GetUser() user: User): Promise<User[]> {
    return await this.friendShipsService.findIncoming(user.id);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  async findFriends(@GetUser() user: User): Promise<User[]> {
    return await this.friendShipsService.findFriends(user.id);
  }
}
