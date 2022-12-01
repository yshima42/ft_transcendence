import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
