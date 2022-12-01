import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  // Delete,
  // Logger,
  UseGuards,
} from '@nestjs/common';
import { ChatRoom, ChatMessage } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { CreateChatRoomDto } from './dto/create-chat.dto';

// import { UpdateChatRoomDto } from './dto/update-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createChatRoomDto: CreateChatRoomDto
  ): Promise<ChatRoom> {
    return await this.chatService.create(createChatRoomDto);
  }

  @Get('messages/:id')
  @UseGuards(JwtAuthGuard)
  async findChatMessages(@Param('id') id: string): Promise<ChatMessage[]> {
    return await this.chatService.findChatMessages(id);
  }

  // @Get()
  // findAll() {
  //   return this.chatService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.chatService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateChatRoomDto: UpdateChatRoomDto
  // ) {
  //   return this.chatService.update(+id, updateChatRoomDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.chatService.remove(+id);
  // }
}
