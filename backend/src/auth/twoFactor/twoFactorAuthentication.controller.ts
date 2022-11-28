import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Response } from 'express';
import { GetUser } from '../decorator/get-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService
  ) {}

  // TODO eslint error
  /* eslint-disable */
  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async register(@Res() response: Response, @GetUser() user: User) {
    const { otpauthUrl } =
      await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
        user
      );

    return await this.twoFactorAuthenticationService.pipeQrCodeStream(
      response,
      otpauthUrl
    );
  }
  /* eslint-enable */
}
