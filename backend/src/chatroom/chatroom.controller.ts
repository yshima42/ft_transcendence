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
import { ResponseChatRoom } from './chatroom.interface';
import { ChatroomService } from './chatroom.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';

@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createChatroomDto: CreateChatroomDto
  ): Promise<ChatRoom> {
    return await this.chatroomService.create(createChatroomDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<ResponseChatRoom[]> {
    return await this.chatroomService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<ChatRoom> {
    return await this.chatroomService.findOne(id);
  }
}
