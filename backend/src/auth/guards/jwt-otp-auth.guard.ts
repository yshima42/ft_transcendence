import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtOtpAuthGuard extends AuthGuard('jwt-otp') {}
