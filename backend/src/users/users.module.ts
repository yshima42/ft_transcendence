import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BlocksModule } from 'src/blocks/blocks.module';
import { FileModule } from 'src/file/file.module';
import { FriendRequestsModule } from 'src/friend-requests/friend-requests.module';
import { GameModule } from 'src/game/game.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersGateway } from './users.gateway';
import { UsersService } from './users.service';

@Module({
  imports: [
    PrismaModule,
    FileModule,
    GameModule,
    BlocksModule,
    FriendRequestsModule,
    JwtModule.register({}),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersGateway],
  exports: [UsersService],
})
export class UsersModule {}
