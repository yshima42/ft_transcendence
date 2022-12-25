import { Module, forwardRef } from '@nestjs/common';
import { ChatRoomModule } from 'src/chat-room/chat-room.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { ChatRoomMemberController } from './chat-room-member.controller';
import { ChatRoomMemberGateway } from './chat-room-member.gateway';
import { ChatRoomMemberService } from './chat-room-member.service';

@Module({
  imports: [PrismaModule, forwardRef(() => ChatRoomModule), UsersModule],
  controllers: [ChatRoomMemberController],
  providers: [ChatRoomMemberService, ChatRoomMemberGateway],
  exports: [ChatRoomMemberService],
})
export class ChatRoomMemberModule {}
