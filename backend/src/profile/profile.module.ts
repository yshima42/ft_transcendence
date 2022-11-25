import { Module } from '@nestjs/common';
import { FileService } from 'src/file/file.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from 'src/users/users.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProfileController],
  providers: [UsersService, ProfileService, FileService],
  exports: [ProfileService],
})
export class ProfileModule {}
