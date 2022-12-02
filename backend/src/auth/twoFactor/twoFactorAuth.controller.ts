import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  Res,
  UseGuards,
  HttpCode,
  Redirect,
  Query,
  Get,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CookieOptions } from 'csurf';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';
import { GetUser } from '../decorator/get-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { TwoFactorAuthService } from './twoFactorAuth.service';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly usersService: UsersService
  ) {}

  readonly cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    // secure: false,
    sameSite: 'none',
    path: '/',
  };

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async register(@GetUser() user: User): Promise<{ url: string }> {
    const { otpauthUrl } =
      await this.twoFactorAuthService.generateTwoFactorAuthSecret(user);

    return { url: otpauthUrl };
  }

  @Post('turn-on')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async turnOnTwoFactorAuth(
    @GetUser() user: User
  ): Promise<{ message: string }> {
    await this.usersService.turnOnTwoFactorAuth(user.id);

    return { message: 'ok' };
  }

  @Post('turn-off')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async turnOffTwoFactorAuth(
    @GetUser() user: User
  ): Promise<{ message: string }> {
    await this.usersService.turnOffTwoFactorAuth(user.id);

    return { message: 'ok' };
  }

  @Get('authenticate')
  @HttpCode(200)
  @Redirect('http://localhost:5173/app')
  @UseGuards(JwtAuthGuard)
  async authenticate(
    @GetUser() user: User,
    @Query('twoFactorAuthCode') twoFactorAuthCode: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ url: string }> {
    const isCodeValid = this.twoFactorAuthService.isTwoFactorAuthCodeValid(
      twoFactorAuthCode,
      user
    );
    if (!isCodeValid) {
      return { url: 'http://localhost:5173/' };
    }

    const { accessToken } = await this.authService.generateJwt(
      user.id,
      user.name,
      true
    );

    res.cookie('access_token', accessToken, this.cookieOptions);

    return { url: 'http://localhost:5173/app' };
  }
}
