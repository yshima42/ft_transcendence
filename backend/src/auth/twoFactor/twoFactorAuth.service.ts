import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { authenticator } from 'otplib';
import { UsersService } from '../../users/users.service';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {}

  // TODO secret をハッシュ化させる。
  public async generateTwoFactorAuthSecret(user: User): Promise<{
    secret: string;
    otpauthUrl: string;
  }> {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(
      user.name,
      this.configService.get<string>(
        'TWO_FACTOR_AUTHENTICATION_APP_NAME'
      ) as string,
      secret
    );

    await this.usersService.setTwoFactorAuthSecret(secret, user.id);

    return {
      secret,
      otpauthUrl,
    };
  }

  public isTwoFactorAuthCodeValid(
    twoFactorAuthCode: string,
    user: User
  ): boolean {
    return authenticator.verify({
      token: twoFactorAuthCode,
      secret: user.twoFactorAuthSecret as string,
    });
  }
}
