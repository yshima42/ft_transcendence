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
import { ApiTags } from '@nestjs/swagger';
import { CookieOptions } from 'csurf';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { GetFtProfile } from './decorator/get-ft-profile.decorator';
import { DummyLoginDto } from './dto/dummy-login.dto';
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
    const signupUser = { name, avatarUrl: ftProfile.imageUrl };
    const { accessToken } = await this.authService.login(name, signupUser);
    res.cookie('access_token', accessToken, this.cookieOptions);

    console.log(ftProfile.intraName, ' login !');
    console.log(accessToken);

    return { message: 'ok' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login/dummy')
  async dummyLogin(
    @Body() dummyLoginDto: DummyLoginDto,
    // @Body() body: { name: string },
    @Res({ passthrough: true }) res: Response
  ): Promise<{ message: string }> {
    const { accessToken } = await this.authService.login(dummyLoginDto.name);
    res.cookie('access_token', accessToken, this.cookieOptions);

    return { message: 'ok' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  logout(@Res({ passthrough: true }) res: Response): { message: string } {
    res.cookie('access_token', '', this.cookieOptions);

    return { message: 'ok' };
  }
}
