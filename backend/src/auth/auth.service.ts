import {
  Injectable,
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUserDto.dto';
import { CredentialsDto } from './dto/credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService
  ) {}

  async signUp(dto: CreateUserDto): Promise<User> {
    const { name } = dto;
    const user = await this.prisma.user
      .create({ data: { name } })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('This name is already exist');
          }
        }
        throw error;
      });

    return user;
  }

  async login(dto: CredentialsDto): Promise<{ accessToken: string }> {
    const { name } = dto;
    const user = await this.prisma.user.findUnique({ where: { name } });

    if (user != null) {
      return await this.generateJwt(user.id, user.name);
    }
    throw new UnauthorizedException('Name incorrect');
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

    return { accessToken: token };
  }
}
