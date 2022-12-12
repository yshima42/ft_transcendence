import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatMessageController } from './chat-message.controller';
import { ChatMessageGateway } from './chat-message.gateway';
import { ChatMessageService } from './chat-message.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ChatMessageController],
  providers: [ChatMessageService, ChatMessageGateway],
})
export class ChatMessageModule {}
