import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { FriendshipsModule } from './friendships/friendships.module';
import { GameModule } from './game/game.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    PrismaModule,
    FileModule,
    GameModule,
    FriendshipsModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
