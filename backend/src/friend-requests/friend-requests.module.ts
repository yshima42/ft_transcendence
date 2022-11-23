import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FriendRequestsController } from './friend-requests.controller';
import { FriendRequestsService } from './friend-requests.service';

@Module({
  imports: [PrismaModule],
  controllers: [FriendRequestsController],
  providers: [FriendRequestsService],
})
export class FriendRequestsModule {}
