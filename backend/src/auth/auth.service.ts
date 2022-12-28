import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OneTimePasswordAuth, User } from '@prisma/client';
import { authenticator } from 'otplib';
import { PrismaService } from '../prisma/prisma.service';
import { OneTimePasswordAuthResponse } from './interfaces/otp-auth-response.interface';
import { SignUpUser } from './interfaces/sign-up-user.interface';
import { UpdateOtpAuth } from './interfaces/update-otp-auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService
  ) {}

  async login(
    name: string,
    signUpUser?: SignUpUser
  ): Promise<{
    accessToken: string;
    isOtpAuthEnabled: boolean;
    isSignUp: boolean;
  }> {
    let user = await this.prisma.user.findUnique({ where: { name } });
    const isSignUp = user === null;

    if (user === null) {
      if (signUpUser === undefined) {
        throw new UnauthorizedException('Name incorrect');
      }
      user = await this.prisma.user.create({ data: signUpUser });
    }

    const { accessToken } = await this.generateJwt(user.id, user.name);

    const { isOtpAuthEnabled } = await this.findOtpAuth(user.id);

    return { accessToken, isOtpAuthEnabled, isSignUp };
  }

  async generateJwt(
    id: string,
    name: string,
    isOtpValid = false
  ): Promise<{ accessToken: string }> {
    const payload = { id, name, isOtpValid };
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: this.config.get('JWT_SECRET') as string,
    });

    return { accessToken };
  }

  /**
   * OneTimePassword Auth
   */

  async findOtpAuth(authUserId: string): Promise<OneTimePasswordAuthResponse> {
    const oneTimePasswordAuth =
      await this.prisma.oneTimePasswordAuth.findUnique({
        where: { authUserId },
      });

    if (oneTimePasswordAuth === null) {
      throw new BadRequestException('Invalid userId');
    }

    return this.excludeOtpSecret(oneTimePasswordAuth);
  }

  async createOtpAuthQrcodeUrl(
    user: User
  ): Promise<OneTimePasswordAuthResponse> {
    const secret = authenticator.generateSecret();

    const qrcodeUrl = authenticator.keyuri(
      user.name,
      this.config.get<string>('TWO_FACTOR_AUTHENTICATION_APP_NAME') as string,
      secret
    );

    const oneTimePasswordAuth = await this.prisma.oneTimePasswordAuth.update({
      where: { authUserId: user.id },
      data: {
        qrcodeUrl,
        secret,
      },
    });

    return this.excludeOtpSecret(oneTimePasswordAuth);
  }

  async activeOtp(
    user: User,
    oneTimePassword: string
  ): Promise<{
    otpAuthResponse: OneTimePasswordAuthResponse;
    accessToken: string;
  }> {
    const { accessToken } = await this.validateOtp(oneTimePassword, user);

    const otpAuthResponse = await this.updateOtp(user.id, {
      isOtpAuthEnabled: true,
    });

    return { otpAuthResponse, accessToken };
  }

  async inactiveOtp(user: User): Promise<{
    otpAuthResponse: OneTimePasswordAuthResponse;
    accessToken: string;
  }> {
    const otpAuthResponse = await this.updateOtp(user.id, {
      isOtpAuthEnabled: false,
      qrcodeUrl: null,
      secret: null,
    });

    const { accessToken } = await this.generateJwt(user.id, user.name, false);

    return { otpAuthResponse, accessToken };
  }

  async updateOtp(
    authUserId: string,
    updateOtpAuth: UpdateOtpAuth
  ): Promise<OneTimePasswordAuthResponse> {
    const oneTimePasswordAuth = await this.prisma.oneTimePasswordAuth.update({
      where: { authUserId },
      data: updateOtpAuth,
    });

    return this.excludeOtpSecret(oneTimePasswordAuth);
  }

  async validateOtp(
    oneTimePassword: string,
    user: User
  ): Promise<{ accessToken: string }> {
    const ret = await this.prisma.oneTimePasswordAuth.findUnique({
      where: { authUserId: user.id },
    });
    if (ret === null) throw new BadRequestException('Invalid userId.');

    if (ret.secret === null || ret.secret === '')
      throw new BadRequestException('OneTimePasswordAuth is inactive.');

    const isCodeValid = authenticator.verify({
      token: oneTimePassword,
      secret: ret.secret,
    });

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    return await this.generateJwt(user.id, user.name, true);
  }

  excludeOtpSecret(
    oneTimePasswordAuth: OneTimePasswordAuth
  ): OneTimePasswordAuthResponse {
    const { authUserId, isOtpAuthEnabled, qrcodeUrl, createdAt } =
      oneTimePasswordAuth;

    const oneTimePasswordAuthResponse = {
      authUserId,
      isOtpAuthEnabled,
      qrcodeUrl,
      createdAt,
    };

    return oneTimePasswordAuthResponse;
  }
}
