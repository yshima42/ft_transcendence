import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  Res,
  UseGuards,
  HttpCode,
  UnauthorizedException,
  Body,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { GetUser } from '../decorator/get-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { TwoFactorAuthenticationCodeDto } from './dto/twoFactorAuthenticationCode.dto';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly usersService: UsersService
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

  // TODO eslint error
  /* eslint-disable */
  @Post('turn-on')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async turnOnTwoFactorAuthentication(
    @GetUser() user: User,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto
  ) {
    const isCodeValid =
      this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        user
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.usersService.turnOnTwoFactorAuthentication(user.id);
  }
  /* eslint-enable */
}
