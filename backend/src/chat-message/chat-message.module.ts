import { Module } from '@nestjs/common';
import { ChatRoomMemberModule } from '../chat-room-member/chat-room-member.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatMessageController } from './chat-message.controller';
import { ChatMessageService } from './chat-message.service';

@Module({
  imports: [PrismaModule, ChatRoomMemberModule],
  controllers: [ChatMessageController],
  providers: [ChatMessageService],
  exports: [ChatMessageService],
})
export class ChatMessageModule {}
