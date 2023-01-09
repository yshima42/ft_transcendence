import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { BlocksModule } from './blocks/blocks.module';
import { ChatMessageModule } from './chat-message/chat-message.module';
import { ChatRoomMemberModule } from './chat-room-member/chat-room-member.module';
import { ChatRoomModule } from './chat-room/chat-room.module';
import { ChatModule } from './chat/chat.module';
import { DmRoomModule } from './dm-room/dm-room.module';
import { DmModule } from './dm/dm.module';
import { FileModule } from './file/file.module';
import { FriendRequestsModule } from './friend-requests/friend-requests.module';
import { GameModule } from './game/game.module';
import { PrismaModule } from './prisma/prisma.module';
import { SocketModule } from './socket/socket.module';
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
    ChatRoomModule,
    DmRoomModule,
    SocketModule,
    ChatRoomMemberModule,
    ScheduleModule.forRoot(),
    ChatModule,
    JwtModule.register({}),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
