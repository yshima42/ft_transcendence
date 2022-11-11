import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly config: ConfigService) {
    super({
      clientID: config.get<string>('FT_CID'),
      clientSecret: config.get<string>('FT_SECRET'),
      callbackURL: 'http://localhost:3000/auth/login/42/return',
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile
  ): { intraname: string } {
    const intraname: string = profile.username;

    return { intraname };
  }
}
