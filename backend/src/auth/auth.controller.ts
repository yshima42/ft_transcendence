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
  Delete,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CookieOptions } from 'csurf';
import { Response } from 'express';
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
    const { accessToken, twoFactorAuthState } = await this.authService.login(
      name,
      signupUser
    );
    res.cookie('access_token', accessToken, this.cookieOptions);

    console.log(ftProfile.intraName, ' login !');
    console.log(accessToken);

    if (twoFactorAuthState) {
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
    const { accessToken, twoFactorAuthState } = await this.authService.login(
      name
    );
    res.cookie('access_token', accessToken, this.cookieOptions);

    if (twoFactorAuthState) {
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

  /**
   * TwoFactorAuthテーブルに新規レコードを追加。
   * @param user - 対象ユーザー
   * @param res - cookie用
   * @returns message
   */
  @Post('2fa')
  @UseGuards(JwtTwoFactorAuthGuard)
  async createTwoFactorAuth(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ message: string }> {
    await this.authService.createTwoFactorAuth(user);

    const { accessToken } = await this.authService.generateJwt(
      user.id,
      user.name,
      true
    );

    res.cookie('access_token', accessToken, this.cookieOptions);

    return { message: 'ok' };
  }

  /**
   * TwoFactorAuthテーブルからレコード削除。
   * @param user - 対象ユーザー
   * @param res - cookie用
   * @returns message
   */
  @Delete('2fa')
  @UseGuards(JwtTwoFactorAuthGuard)
  async deleteTwoFactorAuth(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ message: string }> {
    await this.authService.deleteTwoFactorAuth(user);

    const { accessToken } = await this.authService.generateJwt(
      user.id,
      user.name,
      false
    );

    res.cookie('access_token', accessToken, this.cookieOptions);

    return { message: 'ok' };
  }

  /**
   * 対象ユーザーのワンタイムパスワード生成用QRコードのURLを返す。
   * @param user
   * @returns
   */
  @Get('2fa')
  @UseGuards(JwtTwoFactorAuthGuard)
  async getQrcodeUrl(@GetUser() user: User): Promise<{ qrcodeUrl: string }> {
    return await this.authService.getQrcodeUrl(user);
  }

  /**
   * TwoFactorAuthテーブル上に、特定のユーザーのレコードが存在するか確認。
   * @param user
   * @returns trueなら2FA有効。falseなら無効。
   */
  @Get('2fa/state')
  @UseGuards(JwtTwoFactorAuthGuard)
  async getTwoFactorAuthState(@GetUser() user: User): Promise<boolean> {
    return await this.authService.getTwoFactorAuthState(user.id);
  }

  /**
   * 入力されたワンタイムパスワードの検証。
   * 正しければ、valid=trueを付与したaccessTokenを
   * cookieに割り当てて、アプリトップへリダイレクト。
   * 間違っていれば、ログインページにリダイレクト。
   * @param user
   * @param oneTimePassword - クエリから取得。
   * @param res - cookie用
   * @returns リダイレクト先
   */
  @Get('2fa/validation')
  @HttpCode(200)
  @Redirect('http://localhost:5173/app')
  @UseGuards(JwtAuthGuard)
  async validateOneTimePassword(
    @GetUser() user: User,
    @Query('oneTimePassword') oneTimePassword: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ url: string }> {
    const isCodeValid = await this.authService.oneTimePasswordValidate(
      oneTimePassword,
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
