import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BlocksModule } from './blocks/blocks.module';
import { ChatModule } from './chat/chat.module';
import { DmModule } from './dm/dm.module';
import { FileModule } from './file/file.module';
import { FriendRequestsModule } from './friend-requests/friend-requests.module';
import { GameModule } from './game/game.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'invalid'}`],
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    FileModule,
    GameModule,
    FriendRequestsModule,
    BlocksModule,
    ChatModule,
    DmModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
