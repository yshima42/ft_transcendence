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

// import { UpdateChatroomDto } from './dto/update-chatroom.dto';

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

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateChatroomDto: UpdateChatroomDto
  // ) {
  //   return this.chatroomService.update(+id, updateChatroomDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.chatroomService.remove(+id);
  // }
}
