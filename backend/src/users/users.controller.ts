import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
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

  @Post(':id/friends')
  @UseGuards(JwtAuthGuard)
  async sendFriendRequest(
    @Param('id') id: string,
    @GetUser() user: User
  ): Promise<User> {
    return await this.usersService.sendFriendRequest(id, user);
  }

  @Get(':id/following')
  @UseGuards(JwtAuthGuard)
  async findFollowing(@Param('id') id: string): Promise<User[]> {
    return await this.usersService.findFollowing(id);
  }

  @Get(':id/followedBy')
  @UseGuards(JwtAuthGuard)
  async findFollowedBy(@Param('id') id: string): Promise<User[]> {
    return await this.usersService.findFollowedBy(id);
  }

  @Get(':id/friends')
  @UseGuards(JwtAuthGuard)
  async findFriends(@Param('id') id: string): Promise<User[]> {
    return await this.usersService.findFriends(id);
  }

  // @Post(':id/friends')
  // @UseGuards(JwtAuthGuard)
  // sendFriendRequest(@Param('id') id: string, @GetUser() user: User): string {
  //   console.log(id);
  //   console.log(user);

  //   return `${user.name} follows ${id}`;
  // }

  // @Get(':id')
  // @UseGuards(JwtAuthGuard)
  // displayId(@Param('id') id: string): string {
  //   return this.usersService.displayId(id);
  // }

  // @Get('follow/:id')
  // @UseGuards(JwtAuthGuard)
  // displayFollowId(@Param('id') id: string): string {
  //   console.log(`follow ${id}`);

  //   return `followed`;
  // }
}
