import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  // Delete,
  UseGuards,
} from '@nestjs/common';
import * as Sw from '@nestjs/swagger';
import { ChatRoom, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtTwoFactorAuthGuard } from 'src/auth/guards/jwt-two-factor-auth.guard';
import { ResponseChatRoom } from './chat-room.interface';
import { ChatRoomService } from './chat-room.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
@Controller('chat/room')
@Sw.ApiTags('chat-room')
@UseGuards(JwtTwoFactorAuthGuard)
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Post()
  async create(
    @Body() createChatroomDto: CreateChatRoomDto,
    @GetUser() user: User
  ): Promise<Omit<ChatRoom, 'password'>> {
    return await this.chatRoomService.create(createChatroomDto, user.id);
  }

  // 自分が入っていないチャット全部
  @Get('all')
  async findAllWithOutMe(@GetUser() user: User): Promise<ResponseChatRoom[]> {
    return await this.chatRoomService.findAllWithOutMe(user.id);
  }

  // 自分が入っているチャット全部
  @Get('me')
  async findAllByMe(@GetUser() user: User): Promise<ResponseChatRoom[]> {
    return await this.chatRoomService.findAllByMe(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ChatRoom> {
    return await this.chatRoomService.findOne(id);
  }

  // update
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateChatRoomDto: UpdateChatRoomDto,
    @GetUser() user: User
  ): Promise<ChatRoom> {
    return await this.chatRoomService.update(id, updateChatRoomDto, user.id);
  }
}
