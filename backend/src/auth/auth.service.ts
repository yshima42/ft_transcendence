import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OneTimePasswordAuth, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { authenticator } from 'otplib';
import { PrismaService } from '../prisma/prisma.service';
import { SignupUser } from './interfaces/signup-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService
  ) {}

  async login(
    name: string,
    signupUser?: SignupUser
  ): Promise<{
    accessToken: string;
    isOtpAuthEnabled: boolean;
  }> {
    let user = await this.prisma.user.findUnique({ where: { name } });
    if (user === null) {
      if (signupUser === undefined) {
        throw new UnauthorizedException('Name incorrect');
      }
      user = await this.prisma.user.create({ data: signupUser });
    }

    const { accessToken } = await this.generateJwt(user.id, user.name);

    const isOtpAuthEnabled = await this.isOtpAuthEnabled(user.id);

    return { accessToken, isOtpAuthEnabled };
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
   * 特定のユーザーが２要素認証を有効にしているかどうか確認する。
   * TwoFactorAuthテーブルにレコードがあるかどうかで確認。
   * 存在すれば、OTPが有効。存在しなければ無効。
   * @param authUserId
   * @returns bool値
   */
  async isOtpAuthEnabled(authUserId: string): Promise<boolean> {
    const ret = await this.prisma.oneTimePasswordAuth.findUnique({
      where: { authUserId },
    });

    return ret !== null;
  }

  /**
   * ワンタイムパスワード生成用のシークレットとurlを生成し。
   * TwoFactorAuthテーブルに新規レコード作成。
   * @param user
   * @returns 登録されたTwoFactorAuthレコード
   */
  async createOtpAuth(user: User): Promise<OneTimePasswordAuth> {
    const secret = authenticator.generateSecret();

    const qrcodeUrl = authenticator.keyuri(
      user.name,
      this.config.get<string>('TWO_FACTOR_AUTHENTICATION_APP_NAME') as string,
      secret
    );

    try {
      const oneTimePasswordAuth = await this.prisma.oneTimePasswordAuth.create({
        data: {
          authUserId: user.id,
          qrcodeUrl,
          secret,
        },
      });

      return oneTimePasswordAuth;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(
            'OneTimePassword is already exists',
            HttpStatus.CONFLICT
          );
        }
      }
      throw new BadRequestException('createTwoFactorAuth failed.');
    }
  }

  /**
   * TwoFactorAuthテーブルからレコードを削除。
   * データベースに該当がなければ例外送出。
   * @param user
   * @returns 削除されたTwoFactorAuthレコード
   */
  async deleteOtpAuth(user: User): Promise<OneTimePasswordAuth> {
    try {
      return await this.prisma.oneTimePasswordAuth.delete({
        where: {
          authUserId: user.id,
        },
      });
    } catch (error) {
      throw new BadRequestException('deleteTwoFactorAuth failed.');
    }
  }

  /**
   * 対象ユーザーのワンタイムパスワード生成用QRコードのURLを返す。
   * @param user
   * @returns qrcodeUrl
   */
  async getOtpQrcodeUrl(user: User): Promise<{ qrcodeUrl: string }> {
    const ret = await this.prisma.oneTimePasswordAuth.findUnique({
      where: { authUserId: user.id },
    });
    if (ret === null) return { qrcodeUrl: '' };

    return { qrcodeUrl: ret.qrcodeUrl };
  }

  /**
   * 入力されたワンタイムパスワードを検証する。
   * @param oneTimePassword - 入力されたワンタイムパスワード
   * @param user - ログインユーザー
   * @returns bool値(検証結果)
   */
  async validateOtp(oneTimePassword: string, user: User): Promise<boolean> {
    const ret = await this.prisma.oneTimePasswordAuth.findUnique({
      where: { authUserId: user.id },
    });
    if (ret === null)
      throw new BadRequestException(
        'This user does not exist in OneTimePassword table.'
      );

    return authenticator.verify({
      token: oneTimePassword,
      secret: ret.secret,
    });
  }
}
