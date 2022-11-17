import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Relationship, User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DeleteGuard } from 'src/users/guards/delete.guard';
import { PostGuard } from 'src/users/guards/post.guard';
import { FriendshipsService } from './friendships.service';

@Controller('friendships')
export class FriendshipsController {
  constructor(private readonly friendShipsService: FriendshipsService) {}

  @Post(':id/friends')
  @UseGuards(JwtAuthGuard, PostGuard)
  async addFriend(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('peerId', ParseUUIDPipe) peerId: string
  ): Promise<[Relationship, Relationship]> {
    return await this.friendShipsService.addFriend(id, peerId);
  }

  @Delete(':id/friends')
  @UseGuards(JwtAuthGuard, DeleteGuard)
  async deleteFriend(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('peerId', ParseUUIDPipe) peerId: string
  ): Promise<[Relationship, Relationship]> {
    return await this.friendShipsService.deleteFriend(id, peerId);
  }

  @Get(':id/requesting')
  @UseGuards(JwtAuthGuard)
  async findRequesting(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<User[]> {
    return await this.friendShipsService.findRequesting(id);
  }

  @Get(':id/pending')
  @UseGuards(JwtAuthGuard)
  async findPending(@Param('id', ParseUUIDPipe) id: string): Promise<User[]> {
    return await this.friendShipsService.findPending(id);
  }

  @Get(':id/friends')
  @UseGuards(JwtAuthGuard)
  async findFriends(@Param('id', ParseUUIDPipe) id: string): Promise<User[]> {
    return await this.friendShipsService.findFriends(id);
  }
}
