import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(
  Strategy,
  'jwt-two-factor'
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: { cookies?: { access_token?: string } }) => {
          const jwt = req?.cookies?.access_token ?? '';

          return jwt;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') as string,
    });
  }

  async validate(payload: {
    id: string;
    name: string;
    isTwoFactorAuthenticated: boolean;
  }): Promise<{ user: User }> {
    const { id, isTwoFactorAuthenticated } = payload;
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (user === null) {
      throw new UnauthorizedException();
    }

    if (!user.isTwoFactorAuthEnabled) {
      return { user };
    }

    if (isTwoFactorAuthenticated) {
      return { user };
    }

    // TODO this is ok ?
    throw new UnauthorizedException();
  }
}
