import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Logger,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ChatMessage, User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResponseChatMessage } from './chat-message.interface';
import { ChatMessageService } from './chat-message.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@Controller('chat/:chatRoomId/message')
export class ChatMessageController {
  constructor(private readonly chatMessageService: ChatMessageService) {}

  // create
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('chatRoomId', new ParseUUIDPipe()) chatRoomId: string,
    @Body() createChatMessageDto: CreateChatMessageDto,
    @GetUser() user: User
  ): Promise<ChatMessage> {
    Logger.debug(
      `createChatMessageDto: ${JSON.stringify(createChatMessageDto)}`
    );

    return await this.chatMessageService.create(
      createChatMessageDto,
      chatRoomId,
      user.id
    );
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Param('chatRoomId') chatRoomId: string
  ): Promise<ResponseChatMessage[]> {
    return await this.chatMessageService.findAll(chatRoomId);
  }
}
