import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chatroom.service';

@Module({
  imports: [PrismaModule],
  controllers: [ChatroomController],
  providers: [ChatroomService],
})
export class ChatroomModule {}
