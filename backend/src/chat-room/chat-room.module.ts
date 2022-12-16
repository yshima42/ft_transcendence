import { Module, forwardRef } from '@nestjs/common';
import { ChatRoomUserModule } from 'src/chat-room-user/chat-room-user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatRoomController } from './chat-room.controller';
import { ChatRoomService } from './chat-room.service';

@Module({
  imports: [PrismaModule, forwardRef(() => ChatRoomUserModule)],
  controllers: [ChatRoomController],
  providers: [ChatRoomService],
  exports: [ChatRoomService],
})
export class ChatRoomModule {}
