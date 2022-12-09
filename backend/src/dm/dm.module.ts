import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DmController } from './dm.controller';
import { DmService } from './dm.service';

@Module({
  imports: [PrismaModule],
  controllers: [DmController],
  providers: [DmService],
})
export class DmModule {}
