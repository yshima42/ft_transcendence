import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  // Delete,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { ChatMessage, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResponseChatMessage } from './chat.interface';
import { ChatService } from './chat.service';
import { CreateChatMessageDto } from './dto/create-chat.dto';

// import { UpdateChatRoomDto } from './dto/update-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createChatMessageDto: CreateChatMessageDto,
    @GetUser() user: User
  ): Promise<ChatMessage> {
    Logger.debug(
      `createChatMessageDto: ${JSON.stringify(createChatMessageDto)}`
    );

    return await this.chatService.create(createChatMessageDto, user.id);
  }

  @Get(':chatRoomId')
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Param('chatRoomId') chatRoomId: string
  ): Promise<ResponseChatMessage[]> {
    return await this.chatService.findAll(chatRoomId);
  }

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
