// import { Injectable, ForbiddenException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { AuthDto } from './dto/auth.dto';
// import { Msg, Jwt } from './interfaces/auth.interface';

// @Injectable()
// export class AuthService {
// //   // constructor(
//   //   private readonly prisma: PrismaService,
//   //   private readonly jwt: JwtService,
//   //   private readonly config: ConfigService
//   // ) {}

//   // async signUp(dto: AuthDto): Promise<Msg> {
//   //   try {
//   //     await this.prisma.user.create({
//   //       data: {
//   //         name: dto.name,
//   //       },
//   //     });

//   //     return {
//   //       message: 'ok',
//   //     };
//   //   } catch (error) {
//   //     if (error instanceof PrismaClientKnownRequestError) {
//   //       if (error.code === 'p2002') {
//   //         throw new ForbiddenException('This name is already exist');
//   //       }
//   //     }
//   //     throw error;
//   //   }
//   // }

//   // async login(dto: AuthDto): Promise<Jwt> {
//   //   const user = await this.prisma.user.findUnique({
//   //     where: {
//   //       name: dto.name,
//   //     },
//   //   });
//   //   if (user == null) throw new ForbiddenException('Name incorrect');

//   //   return await this.generateJwt(user.id, user.name);
//   // }

//   // async generateJwt(userId: string, name: string): Promise<Jwt> {
//   //   const payload = {
//   //     sub: userId,
//   //     name,
//   //   };
//   //   const secret: string = this.config.get('JWT_SECRET');
//   //   const token = await this.jwt.signAsync(payload, {
//   //     expiresIn: '5m',
//   //     secret,
//   //   });

//   //   return {
//   //     accessToken: token,
//   //   };
//   // }
// }
