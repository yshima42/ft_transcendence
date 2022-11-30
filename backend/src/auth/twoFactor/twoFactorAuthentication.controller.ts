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
import { CookieOptions } from 'csurf';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';
import { GetUser } from '../decorator/get-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { TwoFactorAuthenticationCodeDto } from './dto/twoFactorAuthenticationCode.dto';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly authService: AuthService,
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly usersService: UsersService
  ) {}

  readonly cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    // secure: false,
    sameSite: 'none',
    path: '/',
  };

  // TODO eslint error
  /* eslint-disable */
  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async register(
    // @Res() response: Response,
    @GetUser() user: User
  ): Promise<{ url: string }> {
    const { otpauthUrl } =
      await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
        user
      );

    return { url: otpauthUrl };
  }
  /* eslint-enable */

  // TODO eslint error
  /* eslint-disable */
  @Post('turn-on')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async turnOnTwoFactorAuthentication(
    @GetUser() user: User
  ): Promise<{ message: string }> {
    await this.usersService.turnOnTwoFactorAuthentication(user.id);

    return { message: 'ok' };
  }
  /* eslint-enable */

  // TODO eslint error
  /* eslint-disable */
  @Post('turn-off')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async turnOffTwoFactorAuthentication(
    @GetUser() user: User
  ): Promise<{ message: string }> {
    await this.usersService.turnOffTwoFactorAuthentication(user.id);
    return { message: 'ok' };
  }
  /* eslint-enable */

  @Post('authenticate')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async authenticate(
    @GetUser() user: User,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ message: string }> {
    const isCodeValid =
      this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode,
        user
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    const { accessToken } = await this.authService.generateJwt(
      user.id,
      user.name,
      true
    );

    res.cookie('access_token', accessToken, this.cookieOptions);

    return { message: 'ok' };
  }
}
