import {
  Injectable,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  async signUp(dto: AuthDto): Promise<{ message: string }> {
    const { name } = dto;
    await this.prisma.user
      .create({
        data: {
          name,
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'p2002') {
            throw new ForbiddenException('This name is already exist');
          }
        }
        throw error;
      });

    return {
      message: 'ok',
    };
  }

  async login(dto: AuthDto): Promise<{ accessToken: string }> {
    const { name } = dto;
    const user = await this.prisma.user.findUnique({
      where: {
        name,
      },
    });
    if (user == null) throw new ForbiddenException('Name incorrect');

    return await this.generateJwt(user.id, user.name);
  }

  async generateJwt(
    userId: string,
    name: string
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      name,
    };
    const secret: string | undefined = this.config.get('JWT_SECRET');
    if (secret === undefined) throw new InternalServerErrorException();

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret,
    });

    return {
      accessToken: token,
    };
  }
}
