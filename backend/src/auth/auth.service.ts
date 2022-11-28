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
  ): Promise<{ accessToken: string }> {
    let user = await this.prisma.user.findUnique({ where: { name } });
    if (user === null) {
      if (signupUser === undefined) {
        throw new UnauthorizedException('Name incorrect');
      }
      user = await this.prisma.user.create({ data: signupUser });
    }

    return await this.generateJwt(user.id, user.name);
  }

  async generateJwt(
    id: string,
    name: string,
    isSecondFactorAuthenticated = false
  ): Promise<{ accessToken: string }> {
    const payload = { id, name, isSecondFactorAuthenticated };
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: this.config.get('JWT_SECRET') as string,
    });

    return { accessToken };
  }
}
