import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  async find(
    @GetUser() user: User,
    @Query('fields') fields: string
  ): Promise<UserDto> {
    return await this.usersService.find(user.id, fields);
  }
}
