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
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CookieOptions } from 'csurf';
import { Response } from 'express';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { GetFtProfile } from './decorator/get-ft-profile.decorator';
import { GetUser } from './decorator/get-user.decorator';
import { FtOauthGuard } from './guards/ft-oauth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtTwoFactorAuthGuard } from './guards/jwt-two-factor-auth.guard';
import { FtProfile } from './interfaces/ft-profile.interface';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

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
    const signupUser = {
      name,
      nickname: name,
      avatarImageUrl: ftProfile.imageUrl,
    };
    const { accessToken, isTwoFactorAuthEnabled } =
      await this.authService.login(name, signupUser);
    res.cookie('access_token', accessToken, this.cookieOptions);

    console.log(ftProfile.intraName, ' login !');
    console.log(accessToken);

    if (isTwoFactorAuthEnabled) {
      return { url: 'http://localhost:5173/twofactor' };
    } else {
      return { url: 'http://localhost:5173/app' };
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('login/dummy')
  @Redirect('http://localhost:5173/app')
  @ApiOperation({
    summary: 'seedで作ったdummy1~5のaccess_tokenを取得(ログイン)',
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
    const { accessToken, isTwoFactorAuthEnabled } =
      await this.authService.login(name);
    res.cookie('access_token', accessToken, this.cookieOptions);

    if (isTwoFactorAuthEnabled) {
      return { url: 'http://localhost:5173/twofactor' };
    } else {
      return { url: 'http://localhost:5173/app' };
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  @ApiOperation({ summary: 'access_tokenのcookieを削除(ログアウト)' })
  logout(@Res({ passthrough: true }) res: Response): { message: string } {
    res.cookie('access_token', '', this.cookieOptions);

    return { message: 'ok' };
  }

  @Get('2fa/generate')
  @UseGuards(JwtTwoFactorAuthGuard)
  async register(@GetUser() user: User): Promise<{ url: string }> {
    const { otpAuthUrl } = await this.authService.generateTwoFactorAuthSecret(
      user
    );

    return { url: otpAuthUrl };
  }

  @Post('2fa/update')
  @UseGuards(JwtTwoFactorAuthGuard)
  async isTwoFactorAuthEnabledUpdate(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<UserDto> {
    const { accessToken } = await this.authService.generateJwt(
      user.id,
      user.name,
      updateUserDto.isTwoFactorAuthEnabled
    );

    res.cookie('access_token', accessToken, this.cookieOptions);

    return await this.usersService.update(user.id, updateUserDto);
  }

  @Get('2fa/authenticate')
  @HttpCode(200)
  @Redirect('http://localhost:5173/app')
  @UseGuards(JwtAuthGuard)
  async authenticate(
    @GetUser() user: User,
    @Query('twoFactorAuthCode') twoFactorAuthCode: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ url: string }> {
    const isCodeValid = this.authService.isTwoFactorAuthCodeValid(
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
