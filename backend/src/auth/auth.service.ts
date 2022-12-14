import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { authenticator } from 'otplib';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpUser } from './interfaces/sign-up-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly usersService: UsersService
  ) {}

  async login(
    name: string,
    signUpUser?: SignUpUser
  ): Promise<{
    accessToken: string;
    isTwoFactorAuthEnabled: boolean;
    isSignUp: boolean;
  }> {
    let user = await this.prisma.user.findUnique({ where: { name } });
    const isSignUp = user === null;

    if (user === null) {
      if (signUpUser === undefined) {
        throw new UnauthorizedException('Name incorrect');
      }
      user = await this.prisma.user.create({ data: signUpUser });
    }

    const { accessToken } = await this.generateJwt(user.id, user.name);
    const { isTwoFactorAuthEnabled } = user;

    return { accessToken, isTwoFactorAuthEnabled, isSignUp };
  }

  async generateJwt(
    id: string,
    name: string,
    isOtpValid = false
  ): Promise<{ accessToken: string }> {
    const payload = { id, name, isOtpValid };
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: this.config.get('JWT_SECRET') as string,
    });

    return { accessToken };
  }

  async generateTwoFactorAuthSecret(user: User): Promise<{
    otpAuthUrl: string;
  }> {
    const secret = authenticator.generateSecret();

    const otpAuthUrl = authenticator.keyuri(
      user.name,
      this.config.get<string>('TWO_FACTOR_AUTHENTICATION_APP_NAME') as string,
      secret
    );

    await this.usersService.update(user.id, {
      twoFactorAuthSecret: secret,
    });

    return {
      otpAuthUrl,
    };
  }

  isTwoFactorAuthCodeValid(twoFactorAuthCode: string, user: User): boolean {
    return authenticator.verify({
      token: twoFactorAuthCode,
      secret: user.twoFactorAuthSecret as string,
    });
  }
}
