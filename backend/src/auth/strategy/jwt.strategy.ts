import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService
  ) {
    super({
      // code for cookie
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let jwt = '';
          /* eslint-disable */
          if (req && req.cookies) {
            jwt = req.cookies.access_token;
          }

          return jwt;
          /* eslint-disable */
        },
      ]),
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET') as string,
    });
  }

  async validate(payload: { id: string }): Promise<{ user: User }> {
    const { id } = payload;
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (user === null) {
      throw new UnauthorizedException();
    }

    return { user };
  }
}
