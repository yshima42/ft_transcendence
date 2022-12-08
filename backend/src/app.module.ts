import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BlocksModule } from './blocks/blocks.module';
import { ChatMessageModule } from './chat-message/chat-message.module';
import { ChatroomModule } from './chat-room/chat-room.module';
import { DmModule } from './dm/dm.module';
import { DmroomModule } from './dmroom/dmroom.module';
import { FileModule } from './file/file.module';
import { FriendRequestsModule } from './friend-requests/friend-requests.module';
import { GameModule } from './game/game.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    FileModule,
    GameModule,
    FriendRequestsModule,
    BlocksModule,
    ChatMessageModule,
    DmModule,
    ChatroomModule,
    DmroomModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
