import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import * as Sw from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtOtpAuthGuard } from 'src/auth/guards/jwt-otp-auth.guard';
import { ResponseChatMessage } from './chat-message.interface';
import { ChatMessageService } from './chat-message.service';

@Controller('chat/rooms/:chatRoomId/messages')
@Sw.ApiTags('chat-message')
@UseGuards(JwtOtpAuthGuard)
export class ChatMessageController {
  constructor(private readonly chatMessageService: ChatMessageService) {}

  @Get()
  async findAllNotBlocked(
    @Param('chatRoomId') chatRoomId: string,
    @GetUser() user: User
  ): Promise<ResponseChatMessage[]> {
    return await this.chatMessageService.findAllNotBlocked(chatRoomId, user.id);
  }
}
