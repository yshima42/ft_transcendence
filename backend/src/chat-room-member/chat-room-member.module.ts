import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatRoomMemberController } from './chat-room-member.controller';
import { ChatRoomMemberService } from './chat-room-member.service';

@Module({
  imports: [PrismaModule, ScheduleModule.forRoot()],
  controllers: [ChatRoomMemberController],
  providers: [ChatRoomMemberService],
  exports: [ChatRoomMemberService],
})
export class ChatRoomMemberModule {}
