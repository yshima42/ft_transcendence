import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BlocksController } from './blocks.controller';
import { BlocksService } from './blocks.service';

@Module({
  imports: [PrismaModule],
  controllers: [BlocksController],
  providers: [BlocksService],
})
export class BlocksModule {}
