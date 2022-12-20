import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BlocksModule } from 'src/blocks/blocks.module';
import { FileModule } from 'src/file/file.module';
import { FriendRequestsModule } from 'src/friend-requests/friend-requests.module';
import { GameModule } from 'src/game/game.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersGateway } from './socket.gateway';

@Module({
  imports: [
    PrismaModule,
    FileModule,
    GameModule,
    BlocksModule,
    FriendRequestsModule,
    JwtModule.register({}),
  ],
  controllers: [],
  providers: [UsersGateway],
  exports: [],
})
export class SocketModule {}
