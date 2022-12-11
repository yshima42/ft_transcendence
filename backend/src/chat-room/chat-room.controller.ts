import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  // Delete,
  UseGuards,
} from '@nestjs/common';
import { ChatRoom, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResponseChatRoom } from './chat-room.interface';
import { ChatRoomService } from './chat-room.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';

@Controller('chat/room')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createChatroomDto: CreateChatRoomDto,
    @GetUser() user: User
  ): Promise<ChatRoom> {
    return await this.chatRoomService.create(createChatroomDto, user.id);
  }

  // 自分が入っていないチャット全部
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@GetUser() user: User): Promise<ResponseChatRoom[]> {
    return await this.chatRoomService.findAll(user.id);
  }

  // 自分が入っているチャット全部
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findAllByMe(@GetUser() user: User): Promise<ResponseChatRoom[]> {
    return await this.chatRoomService.findAllByMe(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<ChatRoom> {
    return await this.chatRoomService.findOne(id);
  }
}
