import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
