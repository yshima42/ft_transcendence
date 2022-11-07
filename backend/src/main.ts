import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
// import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // app.enableCors({
  //   credentials: true,
  //   origin: ['http://localhost:5173'],
  // });
  // app.use(cookieParser());
  await app.listen(3000);
}
void bootstrap();
