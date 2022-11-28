import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { FtStrategy } from './strategy/ft.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { TwoFactorAuthenticationController } from './twoFactor/twoFactorAuthentication.controller';
import { TwoFactorAuthenticationService } from './twoFactor/twoFactorAuthentication.service';

@Module({
  imports: [PrismaModule, JwtModule.register({}), UsersModule],
  controllers: [AuthController, TwoFactorAuthenticationController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    FtStrategy,
    TwoFactorAuthenticationService,
  ],
  exports: [JwtStrategy, JwtAuthGuard],
})
export class AuthModule {}
