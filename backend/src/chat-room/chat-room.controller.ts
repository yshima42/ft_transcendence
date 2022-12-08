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
import { ChatRoom } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResponseChatRoom } from './chat-room.interface';
import { ChatRoomService } from './chat-room.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';

@Controller('chatroom')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createChatroomDto: CreateChatRoomDto
  ): Promise<ChatRoom> {
    return await this.chatRoomService.create(createChatroomDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<ResponseChatRoom[]> {
    return await this.chatRoomService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<ChatRoom> {
    return await this.chatRoomService.findOne(id);
  }
}
