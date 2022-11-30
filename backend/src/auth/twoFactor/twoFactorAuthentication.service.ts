import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { UsersService } from '../../users/users.service';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {}

  // TODO secret をハッシュ化させる必要があるかも。
  public async generateTwoFactorAuthenticationSecret(user: User): Promise<{
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

    await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);

    return {
      secret,
      otpauthUrl,
    };
  }

  // TODO eslint error
  /* eslint-disable */
  public isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    user: User
  ) {
    console.log(twoFactorAuthenticationCode);
    console.log(user);
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthenticationSecret as string,
    });
  }
  /* eslint-enable */

  // TODO eslint error
  /* eslint-disable */
  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return await toFileStream(stream, otpauthUrl);
  }
  /* eslint-enable */
}
