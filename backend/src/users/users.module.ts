import { Module } from '@nestjs/common';
import { BlocksModule } from 'src/blocks/blocks.module';
import { FileModule } from 'src/file/file.module';
import { FriendRequestsModule } from 'src/friend-requests/friend-requests.module';
import { GameModule } from 'src/game/game.module';
import { ProfileModule } from 'src/profile/profile.module';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    FileModule,
    GameModule,
    BlocksModule,
    FriendRequestsModule,
    ProfileModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
