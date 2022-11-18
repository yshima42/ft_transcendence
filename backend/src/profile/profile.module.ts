import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersService } from 'src/users/users.service';
import { ProfileController } from './profile.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ProfileController],
  providers: [UsersService],
})
export class ProfileModule {}
