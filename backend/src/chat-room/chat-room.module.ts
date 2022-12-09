import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatRoomController } from './chat-room.controller';
import { ChatRoomService } from './chat-room.service';

@Module({
  imports: [PrismaModule],
  controllers: [ChatRoomController],
  providers: [ChatRoomService],
})
export class ChatroomModule {}
