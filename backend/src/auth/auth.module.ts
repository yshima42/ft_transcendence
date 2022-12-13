import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtOtpAuthGuard } from './guards/jwt-otp-auth.guard';
import { FtStrategy } from './strategy/ft.strategy';
import { JwtOtpStrategy } from './strategy/jwt-otp.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    FtStrategy,
    JwtOtpStrategy,
    JwtOtpAuthGuard,
  ],
  exports: [JwtStrategy, JwtAuthGuard, JwtOtpStrategy, JwtOtpAuthGuard],
})
export class AuthModule {}
