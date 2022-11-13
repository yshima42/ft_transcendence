import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService
  ) {}

  async login(name: string): Promise<{ accessToken: string }> {
    let user = await this.prisma.user.findUnique({ where: { name } });
    if (user === null) {
      user = await this.prisma.user.create({ data: { name } });
    }

    return await this.generateJwt(user.id, user.name);
  }

  async dummyLogin(name: string): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({ where: { name } });
    if (user === null) {
      throw new UnauthorizedException('Name incorrect');
    }

    return await this.generateJwt(user.id, user.name);
  }

  async generateJwt(
    id: string,
    name: string
  ): Promise<{ accessToken: string }> {
    const payload = { id, name };
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: this.config.get('JWT_SECRET') as string,
    });

    return { accessToken };
  }
}
