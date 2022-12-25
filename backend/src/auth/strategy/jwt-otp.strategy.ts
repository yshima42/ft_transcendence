import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtOtpStrategy extends PassportStrategy(Strategy, 'jwt-otp') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: { cookies?: { accessToken?: string } }) => {
          const jwt = req?.cookies?.accessToken ?? '';

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
    isOtpValid: boolean;
  }): Promise<{ user: User }> {
    const { id, isOtpValid } = payload;
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (user === null) throw new UnauthorizedException();

    const { isOtpAuthEnabled } = await this.authService.isOtpAuthEnabled(
      user.id
    );

    if (isOtpAuthEnabled !== null && isOtpAuthEnabled && !isOtpValid) {
      throw new UnauthorizedException();
    }

    return { user };
  }
}
