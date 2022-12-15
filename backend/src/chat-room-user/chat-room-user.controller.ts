import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import * as Sw from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtOtpAuthGuard } from 'src/auth/guards/jwt-otp-auth.guard';
import { ResponseChatRoomUser } from './chat-room-user.interface';
import { ChatRoomUserService } from './chat-room-user.service';
import { CreateChatRoomUserDto } from './dto/create-chat-room-user.dto';
import { UpdateChatRoomUserDto } from './dto/update-chat-room-user.dto';

@Controller('chat/rooms/:chatRoomId/users')
@Sw.ApiTags('chat-room-user')
@UseGuards(JwtOtpAuthGuard)
export class ChatRoomUserController {
  constructor(private readonly chatRoomUserService: ChatRoomUserService) {}

  @Post()
  async create(
    @Param('chatRoomId', new ParseUUIDPipe()) chatRoomId: string,
    @Body() createChatRoomUserDto: CreateChatRoomUserDto,
    @GetUser() user: User
  ): Promise<void> {
    return await this.chatRoomUserService.create(
      chatRoomId,
      createChatRoomUserDto,
      user.id
    );
  }

  @Get()
  async findAll(
    @Param('chatRoomId', new ParseUUIDPipe()) chatRoomId: string
  ): Promise<ResponseChatRoomUser[]> {
    return await this.chatRoomUserService.findAll(chatRoomId);
  }

  // me
  @Get('me')
  async findMe(
    @Param('chatRoomId', new ParseUUIDPipe()) chatRoomId: string,
    @GetUser() user: User
  ): Promise<ResponseChatRoomUser> {
    return await this.chatRoomUserService.findOne(chatRoomId, user.id);
  }

  @Patch(':userId')
  async update(
    @Param('chatRoomId', new ParseUUIDPipe()) chatRoomId: string,
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() updateChatRoomUserDto: UpdateChatRoomUserDto,
    @GetUser() user: User
  ): Promise<void> {
    return await this.chatRoomUserService.update(
      chatRoomId,
      userId,
      updateChatRoomUserDto,
      user.id
    );
  }

  // 退出
  @Delete('me')
  async removeMe(
    @Param('chatRoomId', new ParseUUIDPipe()) chatRoomId: string,
    @GetUser() user: User
  ): Promise<void> {
    return await this.chatRoomUserService.remove(chatRoomId, user.id);
  }

  @Delete(':userId')
  async remove(
    @Param('chatRoomId', new ParseUUIDPipe()) chatRoomId: string,
    @Param('userId', new ParseUUIDPipe()) userId: string
  ): Promise<void> {
    return await this.chatRoomUserService.remove(chatRoomId, userId);
  }
}
