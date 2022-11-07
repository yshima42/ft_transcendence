import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService
  ) {}

  async login(intraname: string): Promise<{ accessToken: string }> {
    const name: string = intraname;

    let user = await this.prisma.user.findUnique({ where: { name } });
    if (user === null) {
      user = await this.prisma.user.create({ data: { name } });
    }

    const payload: { id: string; name: string } = user;
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: this.config.get('JWT_SECRET') as string,
    });

    return { accessToken };
  }
}
