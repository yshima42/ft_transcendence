import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DmController } from './dm.controller';
import { DmGateway } from './dm.gateway';
import { DmService } from './dm.service';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [DmController],
  providers: [DmService, DmGateway],
})
export class DmModule {}
