import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DmroomController } from './dmroom.controller';
import { DmroomService } from './dmroom.service';

@Module({
  imports: [PrismaModule],
  controllers: [DmroomController],
  providers: [DmroomService],
})
export class DmroomModule {}
