import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetIntraname } from './decorator/get-intraname.decorator';
import { FtOauthGuard } from './guards/ft-oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login/42')
  @UseGuards(FtOauthGuard)
  ftOauth(): void {}

  @Get('login/42/return')
  @UseGuards(FtOauthGuard)
  async ftOauthCallback(
    @GetIntraname() intraname: string
  ): Promise<{ accessToken: string }> {
    console.log(intraname, ' login !');

    return await this.authService.login(intraname);
  }

  // @HttpCode(HttpStatus.OK)
  // @Post('login')
  // async login(
  //   @Body() dto: AuthDto,
  //   @Res({ passthrough: true }) res: Response
  // ): Promise<Msg> {
  //   const jwt = await this.authService.login(dto);
  //   res.cookie('access_token', jwt.accessToken, {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: 'none',
  //     path: '/',
  //   });

  //   return {
  //     message: 'ok',
  //   };
  // }

  // @HttpCode(HttpStatus.OK)
  // @Post('/logout')
  // logout(
  //   @Req() req: Request,
  //   @Res({ passthrough: true }) res: Response
  // ): { message: string } {
  //   res.cookie('access_token', '', {
  //     httpOnly: true,
  //     secure: false,
  //     sameSite: 'none',
  //     path: '/',
  //   });

  //   return { message: 'ok' };
  // }
}
