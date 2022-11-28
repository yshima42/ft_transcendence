import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Res,
  Redirect,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CookieOptions } from 'csurf';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { GetFtProfile } from './decorator/get-ft-profile.decorator';
import { FtOauthGuard } from './guards/ft-oauth.guard';
import { FtProfile } from './interfaces/ft-profile.interface';

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
  ): Promise<{ message: string }> {
    const name = ftProfile.intraName;
    const signupUser = { name, avatarImageUrl: ftProfile.imageUrl };
    const { accessToken } = await this.authService.login(name, signupUser);
    res.cookie('access_token', accessToken, this.cookieOptions);

    console.log(ftProfile.intraName, ' login !');
    console.log(accessToken);

    return { message: 'ok' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login/dummy')
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
    @Body('name') name: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ message: string }> {
    const { accessToken } = await this.authService.login(name);
    res.cookie('access_token', accessToken, this.cookieOptions);

    return { message: 'ok' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  @ApiOperation({ summary: 'access_tokenのcookieを削除(ログアウト)' })
  logout(@Res({ passthrough: true }) res: Response): { message: string } {
    res.cookie('access_token', '', this.cookieOptions);

    return { message: 'ok' };
  }
}
