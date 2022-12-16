import { Module, forwardRef } from '@nestjs/common';
import { ChatRoomMemberModule } from 'src/chat-room-user/chat-room-member.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatRoomController } from './chat-room.controller';
import { ChatRoomService } from './chat-room.service';

@Module({
  imports: [PrismaModule, forwardRef(() => ChatRoomMemberModule)],
  controllers: [ChatRoomController],
  providers: [ChatRoomService],
  exports: [ChatRoomService],
})
export class ChatRoomModule {}
