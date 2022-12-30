import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DmController } from './dm.controller';
import { DmGateway } from './dm.gateway';
import { DmService } from './dm.service';

@Module({
  imports: [PrismaModule],
  controllers: [DmController],
  providers: [DmService, DmGateway],
})
export class DmModule {}
