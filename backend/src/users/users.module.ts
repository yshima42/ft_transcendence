import { Module } from '@nestjs/common';
import { BlocksModule } from 'src/blocks/blocks.module';
import { FileModule } from 'src/file/file.module';
import { GameModule } from 'src/game/game.module';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [AuthModule, PrismaModule, FileModule, GameModule, BlocksModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
