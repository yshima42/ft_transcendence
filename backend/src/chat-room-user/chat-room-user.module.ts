import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatRoomUserController } from './chat-room-user.controller';
import { ChatRoomUserService } from './chat-room-user.service';

@Module({
  imports: [PrismaModule],
  controllers: [ChatRoomUserController],
  providers: [ChatRoomUserService],
})
export class ChatRoomUserModule {}
