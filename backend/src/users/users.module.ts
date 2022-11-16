import { Module } from '@nestjs/common';
import { FileModule } from 'src/file/file.module';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [AuthModule, PrismaModule, FileModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
