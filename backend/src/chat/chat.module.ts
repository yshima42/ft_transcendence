import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ChatMessageModule } from 'src/chat-message/chat-message.module';
import { ChatRoomMemberModule } from 'src/chat-room-member/chat-room-member.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [ChatMessageModule, ChatRoomMemberModule, JwtModule.register({})],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class ChatModule {}
