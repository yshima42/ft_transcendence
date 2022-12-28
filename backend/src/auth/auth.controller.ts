import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Res,
  Redirect,
  Query,
  Body,
  Patch,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CookieOptions } from 'csurf';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { GetFtProfile } from './decorator/get-ft-profile.decorator';
import { GetUser } from './decorator/get-user.decorator';
import { FtOauthGuard } from './guards/ft-oauth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtOtpAuthGuard } from './guards/jwt-otp-auth.guard';
import { FtProfile } from './interfaces/ft-profile.interface';
import { OneTimePasswordAuthResponse } from './interfaces/otp-auth-response.interface';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  readonly cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    // secure: false,
    sameSite: 'none',
    path: '/',
  };

  @Get('login/42')
  @UseGuards(FtOauthGuard)
  ftOauth(): void {}

  @Get('login/42/callback')
  @UseGuards(FtOauthGuard)
  @Redirect('http://localhost:5173/app')
  async ftOauthCallback(
    @GetFtProfile() ftProfile: FtProfile,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ url: string }> {
    const name = ftProfile.intraName;
    const signUpUser = {
      name,
      nickname: name,
      avatarImageUrl: ftProfile.imageUrl,
      oneTimePasswordAuth: {
        create: {},
      },
    };

    const { accessToken, isOtpAuthEnabled, isSignUp } =
      await this.authService.login(name, signUpUser);

    res.cookie('accessToken', accessToken, this.cookieOptions);

    console.log(ftProfile.intraName, ' login !');
    console.log(accessToken);

    if (isSignUp) {
      return { url: 'http://localhost:5173/sign-up' };
    } else if (isOtpAuthEnabled) {
      return { url: 'http://localhost:5173/otp' };
    } else {
      return { url: 'http://localhost:5173/app' };
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('login/dummy')
  @Redirect('http://localhost:5173/app')
  @ApiOperation({
    summary: 'seedで作ったdummy1~5のaccessTokenを取得(ログイン)',
  })
  @ApiBody({
    description: 'seedで作ったdummyのnameを設定',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'dummy1',
        },
      },
    },
  })
  async dummyLogin(
    @Query('name') name: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ url: string }> {
    const { accessToken, isOtpAuthEnabled } = await this.authService.login(
      name
    );
    res.cookie('accessToken', accessToken, this.cookieOptions);

    if (isOtpAuthEnabled) {
      return { url: 'http://localhost:5173/otp' };
    } else {
      return { url: 'http://localhost:5173/app' };
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  @ApiOperation({ summary: 'accessTokenのcookieを削除(ログアウト)' })
  logout(@Res({ passthrough: true }) res: Response): { message: string } {
    res.cookie('accessToken', '', this.cookieOptions);

    return { message: 'ok' };
  }

  /**
   * OneTimePassword Auth
   */

  @Get('otp')
  @UseGuards(JwtOtpAuthGuard)
  async findOtpAuth(
    @GetUser() user: User
  ): Promise<OneTimePasswordAuthResponse> {
    return await this.authService.findOtpAuth(user.id);
  }

  @Post('otp')
  @UseGuards(JwtOtpAuthGuard)
  async createOtpAuthQrcodeUrl(
    @GetUser() user: User
  ): Promise<OneTimePasswordAuthResponse> {
    return await this.authService.createOtpAuthQrcodeUrl(user);
  }

  @Patch('otp/on')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async activateOtp(
    @GetUser() user: User,
    @Body('oneTimePassword') oneTimePassword: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<OneTimePasswordAuthResponse> {
    const { otpAuthResponse, accessToken } = await this.authService.activeOtp(
      user,
      oneTimePassword
    );

    res.cookie('accessToken', accessToken, this.cookieOptions);

    return otpAuthResponse;
  }

  @Patch('otp/off')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async inactivateOtp(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response
  ): Promise<OneTimePasswordAuthResponse> {
    const { otpAuthResponse, accessToken } = await this.authService.inactiveOtp(
      user
    );

    res.cookie('accessToken', accessToken, this.cookieOptions);

    return otpAuthResponse;
  }

  @Post('otp/validation')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async validateOtp(
    @GetUser() user: User,
    @Body('oneTimePassword') oneTimePassword: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ message: string }> {
    const { accessToken } = await this.authService.validateOtp(
      oneTimePassword,
      user
    );

    res.cookie('accessToken', accessToken, this.cookieOptions);

    return { message: 'ok' };
  }
}
