import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BlocksService } from './blocks.service';

@Module({
  imports: [PrismaModule],
  providers: [BlocksService],
  exports: [BlocksService],
})
export class BlocksModule {}
