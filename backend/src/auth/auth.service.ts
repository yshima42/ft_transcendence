import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SignupUser } from './interfaces/signup-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService
  ) {}

  async login(
    name: string,
    signupUser?: SignupUser
  ): Promise<{
    accessToken: string;
    isTwoFactorAuthEnabled: boolean;
  }> {
    let user = await this.prisma.user.findUnique({ where: { name } });
    if (user === null) {
      if (signupUser === undefined) {
        throw new UnauthorizedException('Name incorrect');
      }
      user = await this.prisma.user.create({ data: signupUser });
    }

    const { accessToken } = await this.generateJwt(user.id, user.name);
    const { isTwoFactorAuthEnabled } = user;

    return { accessToken, isTwoFactorAuthEnabled };
  }

  async generateJwt(
    id: string,
    name: string,
    isTwoFactorAuthenticated = false
  ): Promise<{ accessToken: string }> {
    const payload = { id, name, isTwoFactorAuthenticated };
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: this.config.get('JWT_SECRET') as string,
    });

    return { accessToken };
  }
}
