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
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResponseChatRoomUser } from './chat-room-user.interface';
import { ChatRoomUserService } from './chat-room-user.service';
import { UpdateChatRoomUserDto } from './dto/update-chat-room-user.dto';

@Controller('chat/:chatRoomId/user')
export class ChatRoomUserController {
  constructor(private readonly chatRoomUserService: ChatRoomUserService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('chatRoomId', new ParseUUIDPipe()) chatRoomId: string,
    @GetUser() user: User
  ): Promise<void> {
    return await this.chatRoomUserService.create(chatRoomId, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Param('chatRoomId', new ParseUUIDPipe()) chatRoomId: string
  ): Promise<ResponseChatRoomUser[]> {
    return await this.chatRoomUserService.findAll(chatRoomId);
  }

  @Patch(':userId')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('chatRoomId', new ParseUUIDPipe()) chatRoomId: string,
    @Param('userId', new ParseUUIDPipe()) id: string,
    @Body() updateChatRoomUserDto: UpdateChatRoomUserDto
  ): Promise<void> {
    return await this.chatRoomUserService.update(
      chatRoomId,
      id,
      updateChatRoomUserDto
    );
  }

  @Delete(':id')
  async remove(
    @Param('chatRoomId', new ParseUUIDPipe()) chatRoomId: string,
    @Param('id', new ParseUUIDPipe()) id: string
  ): Promise<void> {
    return await this.chatRoomUserService.remove(chatRoomId, id);
  }
}
