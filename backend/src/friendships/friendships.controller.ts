import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Relationship, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserEntity } from 'src/users/entities/user.entity';
import { UpdateRelationshipDto } from './dto/update-relationship.dto';
import { FriendshipsService } from './friendships.service';

@Controller('friendships')
@ApiTags('friendships')
export class FriendshipsController {
  constructor(private readonly friendShipsService: FriendshipsService) {}

  @Post('request')
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'Relationshipが2つ入ったタプルが返ります',
  })
  async addFriend(
    @GetUser() user: User,
    @Body() updateRelationshipDto: UpdateRelationshipDto
  ): Promise<[Relationship, Relationship]> {
    return await this.friendShipsService.request(
      user.id,
      updateRelationshipDto.peerId
    );
  }

  @Post('accept')
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'Relationshipが2つ入ったタプルが返ります',
  })
  async acceptFriend(
    @GetUser() user: User,
    @Body() updateRelationshipDto: UpdateRelationshipDto
  ): Promise<[Relationship, Relationship]> {
    return await this.friendShipsService.accept(
      user.id,
      updateRelationshipDto.peerId
    );
  }

  @Delete('destroy')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Relationshipが2つ入ったタプルが返ります',
  })
  async deleteFriend(
    @GetUser() user: User,
    @Body() updateRelationshipDto: UpdateRelationshipDto
  ): Promise<[Relationship, Relationship]> {
    return await this.friendShipsService.deleteFriend(
      user.id,
      updateRelationshipDto.peerId
    );
  }

  @Delete('cancel')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Relationshipが2つ入ったタプルが返ります',
  })
  async cancelFriend(
    @GetUser() user: User,
    @Body() updateRelationshipDto: UpdateRelationshipDto
  ): Promise<[Relationship, Relationship]> {
    return await this.friendShipsService.deleteFriend(
      user.id,
      updateRelationshipDto.peerId
    );
  }

  @Delete('reject')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Relationshipが2つ入ったタプルが返ります',
  })
  async rejectFriend(
    @GetUser() user: User,
    @Body() updateRelationshipDto: UpdateRelationshipDto
  ): Promise<[Relationship, Relationship]> {
    return await this.friendShipsService.deleteFriend(
      user.id,
      updateRelationshipDto.peerId
    );
  }

  @Get('outgoing')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findOutgoing(@GetUser() user: User): Promise<User[]> {
    return await this.friendShipsService.findOutgoing(user.id);
  }

  @Get('incoming')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findIncoming(@GetUser() user: User): Promise<User[]> {
    return await this.friendShipsService.findIncoming(user.id);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findFriends(@GetUser() user: User): Promise<User[]> {
    return await this.friendShipsService.findFriends(user.id);
  }
}
