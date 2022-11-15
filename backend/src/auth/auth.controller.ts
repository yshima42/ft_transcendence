import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Req,
  Res,
  Redirect,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { GetIntraname } from './decorator/get-intraname.decorator';
import { FtOauthGuard } from './guards/ft-oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login/42')
  @UseGuards(FtOauthGuard)
  ftOauth(): void {}

  @Get('login/42/callback')
  @UseGuards(FtOauthGuard)
  @Redirect('http://localhost:5173/user-list')
  async ftOauthCallback(
    @GetIntraname() intraname: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ message: string }> {
    console.log(intraname, ' login !');

    const jwt = await this.authService.login(intraname);
    res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      // secure: true,
      secure: false,
      sameSite: 'none',
      path: '/',
    });

    return {
      message: 'ok',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login/dummy')
  async dummyLogin(
    @Body() body: { name: string },
    @Res({ passthrough: true }) res: Response
  ): Promise<{ message: string }> {
    const jwt = await this.authService.login(body.name);
    res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      // secure: true,
      secure: false,
      sameSite: 'none',
      path: '/',
    });

    return {
      message: 'ok',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): { message: string } {
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: true,
      // secure: false,
      sameSite: 'none',
      path: '/',
    });

    return { message: 'ok' };
  }
}
