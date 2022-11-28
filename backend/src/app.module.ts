import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BlocksModule } from './blocks/blocks.module';
import { FileModule } from './file/file.module';
import { FriendRequestsModule } from './friend-requests/friend-requests.module';
import { GameModule } from './game/game.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    PrismaModule,
    FileModule,
    GameModule,
    FriendRequestsModule,
    BlocksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
