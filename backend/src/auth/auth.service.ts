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
import { SignUpUser } from './interfaces/sign-up-user.interface';

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
    isOtpAuthEnabled: boolean | null;
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

    const { isOtpAuthEnabled } = await this.isOtpAuthEnabled(user.id);

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
   * 特定のユーザーがOTPによる２要素認証を有効にしているか
   * どうか確認する。
   * OneTimePasswordAuthテーブルのisOtpAuthEnabledを確認。
   * trueならOTPが有効。falseなら無効。
   * レコードがない場合も無効。
   * @param authUserId - uuid(string)
   * @returns bool値またはnull
   */
  async isOtpAuthEnabled(
    authUserId: string
  ): Promise<{ isOtpAuthEnabled: boolean | null }> {
    const ret = await this.prisma.oneTimePasswordAuth.findUnique({
      where: { authUserId },
    });

    return { isOtpAuthEnabled: ret === null ? null : ret.isOtpAuthEnabled };
  }

  /**
   * ワンタイムパスワード生成用のシークレットとurlを生成し。
   * OneTimePasswordAuthテーブルに新規レコード作成。
   * @param user
   * @returns 登録されたOneTimePasswordAuthレコード
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
          isOtpAuthEnabled: false,
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
   * OneTimePasswordAuthテーブルからレコードを削除。
   * データベースに該当がなければ例外送出。
   * @param user
   * @returns 削除されたOneTimePasswordAuthレコード
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
   * ２要素認証を有効化させる。
   * @param user
   * @returns 有効化されたOneTimePasswordAuthレコード
   */
  async activateOtp(user: User): Promise<OneTimePasswordAuth> {
    return await this.prisma.oneTimePasswordAuth.update({
      where: { authUserId: user.id },
      data: { isOtpAuthEnabled: true },
    });
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
