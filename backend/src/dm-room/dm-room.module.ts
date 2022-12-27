import { Module } from '@nestjs/common';
import { FriendRequestsModule } from 'src/friend-requests/friend-requests.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DmRoomController } from './dm-room.controller';
import { DmRoomService } from './dm-room.service';

@Module({
  imports: [PrismaModule, FriendRequestsModule],
  controllers: [DmRoomController],
  providers: [DmRoomService],
})
export class DmRoomModule {}
