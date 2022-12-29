import { Module } from '@nestjs/common';
import { BlocksModule } from 'src/blocks/blocks.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DmRoomController } from './dm-room.controller';
import { DmRoomService } from './dm-room.service';

@Module({
  imports: [PrismaModule, BlocksModule],
  controllers: [DmRoomController],
  providers: [DmRoomService],
})
export class DmRoomModule {}
