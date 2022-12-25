import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { ChatRoomModule } from 'src/chat-room/chat-room.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatRoomMemberController } from './chat-room-member.controller';
import { ChatRoomMemberGateway } from './chat-room-member.gateway';
import { ChatRoomMemberService } from './chat-room-member.service';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => ChatRoomModule),
    ScheduleModule.forRoot(),
    JwtModule.register({}),
  ],
  controllers: [ChatRoomMemberController],
  providers: [ChatRoomMemberService, ChatRoomMemberGateway],
  exports: [ChatRoomMemberService],
})
export class ChatRoomMemberModule {}
