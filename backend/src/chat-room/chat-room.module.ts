import { Module } from '@nestjs/common';
import { ChatRoomUserModule } from 'src/chat-room-user/chat-room-user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatRoomController } from './chat-room.controller';
import { ChatRoomService } from './chat-room.service';

@Module({
  imports: [PrismaModule, ChatRoomUserModule],
  controllers: [ChatRoomController],
  providers: [ChatRoomService],
})
export class ChatroomModule {}
