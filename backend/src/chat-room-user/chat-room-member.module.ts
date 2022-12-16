import { Module, forwardRef } from '@nestjs/common';
import { ChatRoomModule } from 'src/chat-room/chat-room.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatRoomMemberController } from './chat-room-member.controller';
import { ChatRoomMemberService } from './chat-room-member.service';

@Module({
  imports: [PrismaModule, forwardRef(() => ChatRoomModule)],
  controllers: [ChatRoomMemberController],
  providers: [ChatRoomMemberService],
  exports: [ChatRoomMemberService],
})
export class ChatRoomMemberModule {}
