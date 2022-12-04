import { Module } from '@nestjs/common';
import { BlocksModule } from 'src/blocks/blocks.module';
import { FileModule } from 'src/file/file.module';
import { FriendRequestsModule } from 'src/friend-requests/friend-requests.module';
import { GameModule } from 'src/game/game.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    PrismaModule,
    FileModule,
    GameModule,
    BlocksModule,
    FriendRequestsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
