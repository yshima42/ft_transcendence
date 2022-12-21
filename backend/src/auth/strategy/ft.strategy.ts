import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';
import { FtProfile } from '../interfaces/ft-profile.interface';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly config: ConfigService) {
    super({
      clientID: config.get<string>('FT_CID'),
      clientSecret: config.get<string>('FT_SECRET'),
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      callbackURL: `${config.get<string>(
        'BACKEND_URL'
      )}/auth/login/42/callback`,
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile
  ): { ftProfile: FtProfile } {
    const intraName = profile.username;
    const imageUrl = profile._json.image.link;
    const ftProfile = { intraName, imageUrl };

    return { ftProfile };
  }
}
