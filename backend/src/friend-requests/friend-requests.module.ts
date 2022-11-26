import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FriendRequestsService } from './friend-requests.service';

@Module({
  imports: [PrismaModule],
  providers: [FriendRequestsService],
  exports: [FriendRequestsService],
})
export class FriendRequestsModule {}
