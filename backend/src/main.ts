import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // TODO: 本番環境、開発環境でログレベルを切り替える
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });
  // log
  Logger.log('Starting server...');
  Logger.error('internal server error');
  Logger.warn('client error');
  Logger.log('info');
  Logger.debug('development environment');
  Logger.verbose('local environment');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const configService = app.get(ConfigService);
  const frontendUrl = configService.get<string>('FRONTEND_URL') as string;
  app.enableCors({
    credentials: true,
    origin: [`${frontendUrl}`],
  });

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('ft_transcendence')
    .setDescription('The ft_transcendence API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
void bootstrap();
