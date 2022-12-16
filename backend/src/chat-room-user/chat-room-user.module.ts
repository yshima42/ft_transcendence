import { Module, forwardRef } from '@nestjs/common';
import { ChatRoomModule } from 'src/chat-room/chat-room.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatRoomUserController } from './chat-room-user.controller';
import { ChatRoomUserService } from './chat-room-user.service';

@Module({
  imports: [PrismaModule, forwardRef(() => ChatRoomModule)],
  controllers: [ChatRoomUserController],
  providers: [ChatRoomUserService],
  exports: [ChatRoomUserService],
})
export class ChatRoomUserModule {}
