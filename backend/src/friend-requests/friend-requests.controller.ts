import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { FriendRequest, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FriendRequestEntity } from './entities/friend-request.entity';
import { FriendRequestsService } from './friend-requests.service';

@Controller('friend-requests')
@ApiTags('friend-requests')
export class FriendRequestsController {
  constructor(private readonly friendRequestsService: FriendRequestsService) {}

  // @Post('request')
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    schema: {
      properties: {
        receiverId: {
          type: 'string',
          example: '40e8b4b4-9b39-4b7e-8e31-78e31975d320',
        },
      },
    },
  })
  @ApiCreatedResponse({ type: FriendRequestEntity })
  async create(
    @GetUser() user: User,
    @Body('receiverId') receiverId: string
  ): Promise<FriendRequest> {
    return await this.friendRequestsService.create(user.id, receiverId);
  }

  //   @Get()
  //   findAll() {
  //     return this.friendRequestsService.findAll();
  //   }

  //   @Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.friendRequestsService.findOne(+id);
  //   }

  //   @Patch(':id')
  //   update(
  //     @Param('id') id: string,
  //     @Body() updateFriendRequestDto: UpdateFriendRequestDto
  //   ) {
  //     return this.friendRequestsService.update(+id, updateFriendRequestDto);
  //   }

  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.friendRequestsService.remove(+id);
  //   }
}
