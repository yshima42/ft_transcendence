import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
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
    twoFactorAuthState: boolean;
  }> {
    let user = await this.prisma.user.findUnique({ where: { name } });
    if (user === null) {
      if (signupUser === undefined) {
        throw new UnauthorizedException('Name incorrect');
      }
      user = await this.prisma.user.create({ data: signupUser });
    }

    const { accessToken } = await this.generateJwt(user.id, user.name);

    const twoFactorAuthState = await this.getTwoFactorAuthState(user.id);

    return { accessToken, twoFactorAuthState };
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
   * 存在すれば、2FAが有効。存在しなければ無効。
   * @param authUserId
   * @returns bool値
   */
  async getTwoFactorAuthState(authUserId: string): Promise<boolean> {
    const ret = await this.prisma.twoFactorAuth.findUnique({
      where: { authUserId },
    });

    return ret !== null;
  }

  /**
   * ワンタイムパスワード生成用のシークレットを生成し、
   * TwoFactorAuthテーブルに新規レコード作成。
   * @param user
   * @returns ワンタイムパスワード生成用URL
   */
  async createTwoFactorAuth(user: User): Promise<{
    otpAuthUrl: string;
  }> {
    const secret = authenticator.generateSecret();

    const otpAuthUrl = authenticator.keyuri(
      user.name,
      this.config.get<string>('TWO_FACTOR_AUTHENTICATION_APP_NAME') as string,
      secret
    );

    await this.prisma.twoFactorAuth.create({
      data: {
        authUserId: user.id,
        secret,
      },
    });

    return { otpAuthUrl };
  }

  /**
   * TwoFactorAuthテーブルからレコードを削除。
   * データベースに該当がなければ例外送出。
   * @param user
   * @returns 対象ユーザー
   */
  async deleteTwoFactorAuth(user: User): Promise<User> {
    try {
      await this.prisma.twoFactorAuth.delete({
        where: {
          authUserId: user.id,
        },
      });

      return user;
    } catch (error) {
      throw new NotFoundException(
        'This user does not exist in TwoFactorAuth table.'
      );
    }
  }

  /**
   * 入力されたワンタイムパスワードを検証する。
   * @param oneTimePassword - 入力されたワンタイムパスワード
   * @param user - ログインユーザー
   * @returns bool値(検証結果)
   */
  async oneTimePasswordValidate(
    oneTimePassword: string,
    user: User
  ): Promise<boolean> {
    const ret = await this.prisma.twoFactorAuth.findUnique({
      where: { authUserId: user.id },
    });
    if (ret === null)
      throw new NotFoundException(
        'This user does not exist in TwoFactorAuth table.'
      );

    return authenticator.verify({
      token: oneTimePassword,
      secret: ret.secret,
    });
  }
}
