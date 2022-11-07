import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  // Res,
  // Req,
} from '@nestjs/common';
// import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUserDto.dto';
import { CredentialsDto } from './dto/credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() dto: CreateUserDto): Promise<{ message: string }> {
    return await this.authService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: CredentialsDto): Promise<{ accessToken: string }> {
    return await this.authService.login(dto);
  }

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
